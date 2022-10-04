import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { useGetChartData } from 'shared/hooks/useGetChartData';
import { MyQuery, MyDataSourceOptions } from './shared/types';
import PubSub from 'pubsub-js';
export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const promises = options.targets.map(
      ({ spaceId, roomId, contextId, nodes, groupBy, method, refId, dimensions, filterBy, filterValue }) => {
        if (!spaceId || !roomId || !contextId) {
          const frame = new MutableDataFrame({
            refId: refId,
            fields: [
              { name: 'Time', type: FieldType.time },
              { name: 'Value', type: FieldType.number },
            ],
          });
          return Promise.resolve(frame);
        }

        return useGetChartData({
          baseUrl: this.baseUrl,
          spaceId,
          roomId,
          nodes,
          contextId,
          groupBy,
          filterBy,
          filterValue,
          method,
          dimensions,
          from: Math.floor(from / 1000), // this value in seconds
          to: Math.floor(to / 1000), // this value in seconds
        })
          .then((response: any) => {
            PubSub.publish('CHART_DATA', response);

            const frame = new MutableDataFrame({
              refId,
              fields: response.data.result.labels.map((id: string, i: number) => {
                const node = response.data.nodes.find((n: any) => n.id === id);
                return {
                  name: node?.name || id,
                  type: i === 0 ? FieldType.time : FieldType.number,
                };
              }),
            });

            response.data.result.data.forEach((point: any) => {
              frame.appendRow([...point]);
            });

            return frame;
          })
          .catch((error) => {
            console.log('ERROR (useGetChartData): ', error);
            return [];
          });
      }
    );

    return Promise.all(promises).then((data) => ({ data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
