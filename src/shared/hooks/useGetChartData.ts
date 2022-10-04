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
  let aggregations = [];

  switch (groupBy) {
    case 'node':
      aggregations = [
        { method: 'sum', groupBy: ['chart', 'node'] },
        { method, groupBy: ['node'] },
      ];
      break;
    case 'dimension':
      aggregations = [{ method, groupBy: ['dimension'] }];
      break;
    case 'instance':
      aggregations = [{ method: 'sum', groupBy: ['chart', 'node'] }];
      break;
    default:
      aggregations = [
        { method: 'sum', groupBy: ['chart', `label=${groupBy}`] },
        { method: 'avg', groupBy: [`label=${groupBy}`] },
      ];
      break;
  }

  return await Post({
    path: `/v2/spaces/${spaceId}/rooms/${roomId}/data`,
    baseUrl,
    data: {
      filter: {
        nodeIDs: nodes,
        context: contextId,
        dimensions,
        ...(filterBy && filterValue ? { labels: { [filterBy]: [filterValue] } } : {}),
      },
      aggregations,
      agent_options: ['jsonwrap', 'flip', 'ms'],
      points: 335,
      format: 'json',
      group,
      gtime: 0,
      after: from,
      before: to,
      with_metadata: true,
    },
  });
};
