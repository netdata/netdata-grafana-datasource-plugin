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
      metrics = [
        {
          group_by: ['chart', 'node'],
          group_by_label: [],
          aggregation: 'sum',
        },
        {
          group_by: ['node'],
          group_by_label: [],
          aggregation: method,
        },
      ];
      break;
    case 'dimension':
      metrics = [
        {
          group_by: ['dimension'],
          group_by_label: [],
          aggregation: method,
        },
      ];
      break;
    case 'instance':
      metrics = [
        {
          group_by: ['chart', 'node'],
          group_by_label: [],
          aggregation: 'sum',
        },
      ];
      break;
    default:
      metrics = [
        {
          group_by: ['chart'],
          group_by_label: groupBy,
          aggregation: 'sum',
        },
        {
          group_by: [],
          group_by_label: groupBy,
          aggregation: 'avg',
        },
      ];
      break;
  }

  const defaultScopeValue = [];
  const defaultSelectorValue = ['*'];
  const labels = filterBy && filterValue ? [`${filterBy}:${filterValue}`] : null;

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
        labels: labels || defaultScopeValue,
      },
      selectors: {
        contexts: ['*'],
        nodes: ['*'],
        instances: ['*'],
        dimensions: ['*'],
        labels: labels || defaultSelectorValue,
      },
      aggregations: {
        metrics,
        time: { time_group: group, time_resampling: 0 },
      },
      window: { after: from, before: to, points: 269 },
    },
  });
};
