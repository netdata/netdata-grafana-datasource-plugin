import { getSeriesDescriptors } from './series';

const machineGuid1 = '11111111-1111-1111-1111-111111111111';
const machineGuid2 = '22222222-2222-2222-2222-222222222222';

const summary = {
  nodes: [
    { mg: machineGuid1, nd: 'nd-1', nm: 'web01' },
    { mg: machineGuid2, nd: 'nd-2', nm: 'web02' },
  ],
};

describe('getSeriesDescriptors', () => {
  it('names series from view.dimensions.names, not from the machine-readable result.labels', () => {
    // grouping by node: result.labels carries machine guids, names carry hostnames
    const data = {
      summary,
      view: {
        dimensions: {
          grouped_by: ['node'],
          ids: [machineGuid1, machineGuid2],
          names: ['web01', 'web02'],
        },
      },
      result: { labels: ['time', machineGuid1, machineGuid2] },
    };

    expect(getSeriesDescriptors(data)).toEqual([
      { name: 'web01', labels: { node: 'web01' } },
      { name: 'web02', labels: { node: 'web02' } },
    ]);
  });

  it('keeps the node identity when grouping by a label together with node (ticket 835)', () => {
    // this is the case that used to collapse to a bare "/" for every host
    const data = {
      summary,
      view: {
        dimensions: {
          grouped_by: ['label', 'node'],
          ids: [`/,${machineGuid1}`, `/,${machineGuid2}`],
          names: ['/,web01', '/,web02'],
          labels: { mount_point: [['/'], ['/']] },
        },
      },
      result: { labels: ['time', `/,${machineGuid1}`, `/,${machineGuid2}`] },
    };

    expect(getSeriesDescriptors(data)).toEqual([
      { name: '/,web01', labels: { mount_point: '/', node: 'web01' } },
      { name: '/,web02', labels: { mount_point: '/', node: 'web02' } },
    ]);
  });

  it('resolves the node from an instance@machine_guid id', () => {
    const data = {
      summary,
      view: {
        dimensions: {
          grouped_by: ['instance'],
          ids: [`disk_space._@${machineGuid1}`],
          names: ['disk_space._'],
        },
      },
      result: { labels: ['time', `disk_space._@${machineGuid1}`] },
    };

    expect(getSeriesDescriptors(data)).toEqual([{ name: 'disk_space._', labels: { node: 'web01' } }]);
  });

  it('joins multi-valued labels and skips empty ones', () => {
    const data = {
      summary: { nodes: [] },
      view: {
        dimensions: {
          grouped_by: ['dimension'],
          ids: ['used', 'avail'],
          names: ['used', 'avail'],
          labels: { device: [['sda', 'sdb'], []], empty: [null, null] },
        },
      },
      result: { labels: ['time', 'used', 'avail'] },
    };

    expect(getSeriesDescriptors(data)).toEqual([
      { name: 'used', labels: { device: 'sda,sdb' } },
      { name: 'avail', labels: {} },
    ]);
  });

  it('does not overwrite a collected label named "node"', () => {
    const data = {
      summary,
      view: {
        dimensions: {
          grouped_by: ['label', 'node'],
          ids: [`k8s-a,${machineGuid1}`],
          names: ['k8s-a,web01'],
          labels: { node: [['k8s-a']] },
        },
      },
      result: { labels: ['time', `k8s-a,${machineGuid1}`] },
    };

    expect(getSeriesDescriptors(data)[0].labels).toEqual({ node: 'k8s-a' });
  });

  it('falls back to the series id when names are absent', () => {
    const data = {
      summary: { nodes: [] },
      view: { dimensions: { grouped_by: ['dimension'], ids: ['used'] } },
      result: { labels: ['time', 'used'] },
    };

    expect(getSeriesDescriptors(data)).toEqual([{ name: 'used', labels: {} }]);
  });

  it('tolerates an empty or malformed response', () => {
    expect(getSeriesDescriptors(undefined)).toEqual([]);
    expect(getSeriesDescriptors({})).toEqual([]);
    expect(getSeriesDescriptors({ result: { labels: ['time'] } })).toEqual([]);
  });
});
