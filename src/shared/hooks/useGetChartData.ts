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
  let metrics = [];

  switch (groupBy) {
    case 'node':
      metrics = [{ aggregation: method, groupBy: ['node'], group_by_label: [] }];
      break;
    case 'dimension':
      metrics = [{ group_by: ['dimension'], group_by_label: [], aggregation: method }];
      break;
    case 'instance':
      metrics = [{ aggregation: method, groupBy: ['instance'], group_by_label: [] }];
      break;
    default:
      metrics = [{ aggregation: method, groupBy: ['label'], group_by_label: [groupBy] }];
      break;
  }

  const defaultSelectorValue = ['*'];
  const labels = filterBy && filterValue ? [`${filterBy}:${filterValue}`] : [];

  return await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/data`,
    baseUrl,
    data: {
      format: 'json2',
      options: ['jsonwrap', 'flip', 'ms'],
      scope: {
        contexts: [contextId],
        nodes,
        dimensions,
        labels,
      },
      selectors: {
        contexts: ['*'],
        nodes: ['*'],
        instances: ['*'],
        dimensions: dimensions.length ? dimensions : defaultSelectorValue,
        labels: labels.length ? labels : defaultSelectorValue,
      },
      aggregations: {
        metrics,
        time: { time_group: group, time_resampling: 0 },
      },
      window: { after: from, before: to, points: 269 },
    },
  });
};
