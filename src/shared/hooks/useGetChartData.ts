import { Methods } from './../constants';
import { Post } from 'shared/utils/request';
import { buildGrouping } from 'shared/utils/grouping';

type UseGetChartDataType = {
  from: number;
  to: number;
  spaceId?: string;
  roomId?: string;
  nodes?: string[];
  dimensions?: string[];
  contextId?: string;
  groupBy?: string | string[];
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
  groupBy,
  method = Methods[0].value,
  group = 'average',
  dimensions = [],
  from,
  to,
}: UseGetChartDataType) => {
  const metrics = [{ aggregation: method, ...buildGrouping(groupBy) }];

  const defaultSelectorValue = ['*'];
  const labels = filterBy && filterValue ? [`${filterBy}:${filterValue}`] : [];

  return await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/data`,
    baseUrl,
    data: {
      format: 'json2',
      // `group-by-labels` is what makes view.dimensions.labels present in the response
      options: ['jsonwrap', 'flip', 'ms', 'group-by-labels'],
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
