import { GroupByList, Methods } from './../constants';
import { Post } from 'shared/utils/request';

type UseGetChartDataType = {
  from: number;
  to: number;
  spaceId?: string;
  roomId?: string;
  nodes?: string[];
  dimensions?: string[];
  contextId?: string;
  groupBy?: string;
  method?: string;
  group?: string;
  filterBy?: string;
  filterValue?: string;
  baseUrl: string;
};

export const useGetChartData = async ({
  baseUrl,
  roomId,
  nodes = [],
  spaceId,
  contextId,
  filterBy,
  filterValue,
  groupBy = GroupByList[0].value,
  method = Methods[0].value,
  group = 'average',
  dimensions = [],
  from,
  to,
}: UseGetChartDataType) => {
  // let aggregations = [];

  // switch (groupBy) {
  //   case 'node':
  //     aggregations = [
  //       { method: 'sum', groupBy: ['chart', 'node'] },
  //       { method, groupBy: ['node'] },
  //     ];
  //     break;
  //   case 'dimension':
  //     aggregations = [{ method, groupBy: ['dimension'] }];
  //     break;
  //   case 'instance':
  //     aggregations = [{ method: 'sum', groupBy: ['chart', 'node'] }];
  //     break;
  //   default:
  //     aggregations = [
  //       { method: 'sum', groupBy: ['chart', `label=${groupBy}`] },
  //       { method: 'avg', groupBy: [`label=${groupBy}`] },
  //     ];
  //     break;
  // }

  return await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/data`,
    baseUrl,
    data: {
      format: 'json2',
      options: ['jsonwrap', 'nonzero', 'flip', 'ms', 'jw-anomaly-rates', 'minify'],
      scope: {
        contexts: ['mem.thp_details'],
        nodes: [
          '01702efd-af72-45b0-8e2f-33d806e5699f',
          '0a841ab0-bc12-41a0-894a-e41fd5440eb8',
          'ce0e8300-8270-4171-ae48-c452d3b91ba9',
          'e0d74612-cf5a-4030-959c-de5dee3d793a',
          '3ed8bb08-f2d3-4054-b423-67a8313fb130',
          'af4b47bb-d6be-4a46-b6b0-0a735dbc0a4c',
          '2626d41a-39f1-407f-8965-c08d146e8c4d',
          'e48415db-3d25-4521-982c-30e9f46c96d2',
          '382c7e2a-4b64-46ba-b8a5-f5f75eafa3e9',
          '8b9cc340-6d60-47d9-99d5-de43071de8ba',
        ],
      },
      selectors: {
        contexts: ['*'],
        nodes: ['*'],
        instances: ['*'],
        dimensions: ['*'],
        labels: ['*'],
      },
      aggregations: {
        metrics: [
          {
            group_by: ['dimension'],
            group_by_label: [],
            aggregation: 'sum',
          },
        ],
        time: { time_group: 'average', time_resampling: 0 },
      },
      window: { after: 1722412818, before: 1722413718, points: 269 },
    },
  });
};
