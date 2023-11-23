import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { useGetChartData } from 'shared/hooks/useGetChartData';
import { Get } from 'shared/utils/request';
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
      ({ spaceId, roomId, contextId, nodes, groupBy, method, refId, dimensions, filterBy, filterValue, hide }) => {
        if (hide) {
          return null;
        }

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

    return Promise.all(promises.filter(Boolean)).then((data) => ({ data }));
  }

  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await Get({ path: '/v2/accounts/me', baseUrl: this.baseUrl });

      if (response.status === 200 && response?.data?.id !== '00000000-0000-0000-0000-000000000000') {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message:
            response.status === 401 || response?.data?.id !== '00000000-0000-0000-0000-000000000000'
              ? 'Invalid token. Please validate the token defined on the datasource.'
              : response.statusText
              ? response.statusText
              : defaultErrorMessage,
        };
      }
    } catch (err) {
      return {
        status: 'error',
        message: defaultErrorMessage,
      };
    }
  }
}
