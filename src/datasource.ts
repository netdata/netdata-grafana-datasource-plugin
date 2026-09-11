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
import { getSeriesDescriptors } from 'shared/utils/series';
import { chartDataTopic } from 'shared/utils/topics';
import { renderLegend } from 'shared/utils/legend';
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
      ({
        spaceId,
        roomId,
        contextId,
        nodes,
        groupBy,
        method,
        refId,
        dimensions,
        filterBy,
        filterValue,
        group,
        hide,
        legend,
      }) => {
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
          group,
          filterBy,
          filterValue,
          method,
          dimensions,
          from: Math.floor(from / 1000), // this value in seconds
          to: Math.floor(to / 1000), // this value in seconds
        })
          .then((response: any) => {
            // scoped to this query, so sibling QueryEditor rows keep their own option lists
            PubSub.publish(chartDataTopic(refId), response);

            const series = getSeriesDescriptors(response.data);

            const frame = new MutableDataFrame({
              refId,
              fields: [
                { name: 'time', type: FieldType.time },
                ...series.map(({ name, labels }) => {
                  const displayNameFromDS = renderLegend(legend, name, labels);

                  return {
                    name,
                    labels,
                    type: FieldType.number,
                    // left unset without a legend template, so Grafana can still disambiguate
                    // series that share a name across queries
                    ...(displayNameFromDS ? { config: { displayNameFromDS } } : {}),
                  };
                }),
              ],
            });

            const valueIndex = response.data.result.point.value;

            response.data.result.data.forEach((point: any) => {
              const [timestamp, ...rest] = point;
              frame.appendRow([timestamp, ...rest.map((r: any[]) => r[valueIndex])]);
            });

            return frame;
          })
          .catch(() => {
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
