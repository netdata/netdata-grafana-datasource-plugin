import type { Labels } from '@grafana/data';

type SummaryNode = {
  mg?: string;
  nd?: string;
  nm?: string;
  [key: string]: any;
};

export type SeriesDescriptor = {
  name: string;
  labels: Labels;
};

/**
 * Netdata joins the group-by parts of a series id with "," (and "@" for instance@machine_guid)
 * without escaping, so the id cannot be split back apart reliably. Instead of parsing it, look for
 * a part that is a known machine guid - a label value colliding with one is not a realistic case.
 */
const findNode = (seriesId: string, nodesByMachineGuid: Map<string, SummaryNode>) => {
  for (const part of seriesId.split(/[,@]/)) {
    const node = nodesByMachineGuid.get(part);

    if (node) {
      return node;
    }
  }

  return undefined;
};

/**
 * Describes each value series of a json2 response.
 *
 * `result.labels` carries machine-readable ids, which is why grouping by anything other than node
 * used to surface raw values such as "/" in the legend. The human-readable counterpart lives in
 * `view.dimensions.names`, index-aligned with `result.labels` minus its leading "time" entry.
 */
export const getSeriesDescriptors = (data: any): SeriesDescriptor[] => {
  const seriesIds: string[] = (data?.result?.labels ?? []).slice(1);
  const names: string[] = data?.view?.dimensions?.names ?? [];
  // only returned when the request carries the `group-by-labels` option
  const groupByLabels: { [key: string]: Array<string[] | null> } = data?.view?.dimensions?.labels ?? {};
  const nodes: SummaryNode[] = data?.summary?.nodes ?? [];

  const nodesByMachineGuid = new Map<string, SummaryNode>();
  nodes.forEach((node) => {
    if (node?.mg) {
      nodesByMachineGuid.set(node.mg, node);
    }
  });

  // Groupings such as `dimension` leave the node out of the series id entirely. With a single node
  // in scope every series still belongs to it, so the identity is recoverable; with several, the
  // series genuinely aggregates all of them and must stay unlabelled. `summary.nodes` is the only
  // valid source here - `agents` names whichever agent served the query, which is a different node.
  const soleNode = nodes.length === 1 ? nodes[0] : undefined;

  return seriesIds.map((seriesId, index) => {
    const labels: Labels = {};

    Object.keys(groupByLabels).forEach((key) => {
      const values = groupByLabels[key]?.[index];

      if (values?.length) {
        labels[key] = values.join(',');
      }
    });

    // the node identity is not a Netdata label, so it has to come from the summary;
    // a real label named "node" wins, to avoid rewriting collected data
    const node = findNode(seriesId, nodesByMachineGuid) ?? soleNode;

    if (node?.nm && labels.node === undefined) {
      labels.node = node.nm;
    }

    return { name: names[index] || seriesId, labels };
  });
};
