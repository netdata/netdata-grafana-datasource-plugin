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
  ...rest
}: UseGetChartDataType) => {
  console.log({
    baseUrl,
    roomId,
    nodes,
    spaceId,
    contextId,
    filterBy,
    filterValue,
    groupBy,
    method,
    group,
    dimensions,
    from,
    to,
    ...rest,
  });
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
      // metrics = [
      //   { method: 'sum', groupBy: ['chart', 'node'] },
      //   { method, groupBy: ['node'] },
      // ];
      break;
    case 'dimension':
      metrics = [
        {
          group_by: ['dimension'],
          group_by_label: [],
          aggregation: method,
        },
      ];
      // metrics = [{ method, groupBy: ['dimension'] }];
      break;
    case 'instance':
      metrics = [
        {
          group_by: ['chart', 'node'],
          group_by_label: [],
          aggregation: 'sum',
        },
      ];
      // metrics = [{ method: 'sum', groupBy: ['chart', 'node'] }];
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
      // metrics = [
      //   { method: 'sum', groupBy: ['chart', `label=${groupBy}`] },
      //   { method: 'avg', groupBy: [`label=${groupBy}`] },
      // ];
      break;
  }

  return await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/data`,
    baseUrl,
    data: {
      format: 'json2',
      options: ['jsonwrap', 'flip', 'ms'],
      scope: {
        contexts: [contextId],
        nodes,
      },
      selectors: {
        contexts: ['*'],
        nodes: ['*'],
        instances: ['*'],
        dimensions: ['*'],
        labels: ['*'],
      },
      aggregations: {
        metrics,
        time: { time_group: group, time_resampling: 0 },
      },
      window: { after: from, before: to, points: 269 },
    },
  });

  // return await Post({
  //   path: `/v3/spaces/${spaceId}/rooms/${roomId}/data`,
  //   baseUrl,
  //   data: {
  //     filter: {
  //       nodeIDs: nodes,
  //       context: contextId,
  //       dimensions,
  //       ...(filterBy && filterValue ? { labels: { [filterBy]: [filterValue] } } : {}),
  //     },
  //     aggregations,
  //     agent_options: ['jsonwrap', 'flip', 'ms'],
  //     points: 335,
  //     format: 'json',
  //     group,
  //     gtime: 0,
  //     after: from,
  //     before: to,
  //     with_metadata: true,
  //   },
  // });
};
