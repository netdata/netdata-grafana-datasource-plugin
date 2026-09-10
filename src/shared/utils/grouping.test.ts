import { buildGrouping } from './grouping';

describe('buildGrouping', () => {
  it('sends built-in groupings as group_by', () => {
    expect(buildGrouping(['node'])).toEqual({ group_by: ['node'], group_by_label: [] });
    expect(buildGrouping(['instance'])).toEqual({ group_by: ['instance'], group_by_label: [] });
    expect(buildGrouping(['dimension'])).toEqual({ group_by: ['dimension'], group_by_label: [] });
  });

  it('sends label keys as group_by_label behind a single label entry', () => {
    expect(buildGrouping(['mount_point'])).toEqual({ group_by: ['label'], group_by_label: ['mount_point'] });
  });

  it('combines a node grouping with a label grouping (ticket 835)', () => {
    expect(buildGrouping(['node', 'mount_point'])).toEqual({
      group_by: ['node', 'label'],
      group_by_label: ['mount_point'],
    });
  });

  it('supports several label keys at once', () => {
    expect(buildGrouping(['mount_point', 'filesystem'])).toEqual({
      group_by: ['label'],
      group_by_label: ['mount_point', 'filesystem'],
    });
  });

  it('accepts the single-string form saved by older dashboards', () => {
    expect(buildGrouping('node')).toEqual({ group_by: ['node'], group_by_label: [] });
    expect(buildGrouping('mount_point')).toEqual({ group_by: ['label'], group_by_label: ['mount_point'] });
  });

  it('de-duplicates repeated selections', () => {
    expect(buildGrouping(['node', 'node', 'mount_point', 'mount_point'])).toEqual({
      group_by: ['node', 'label'],
      group_by_label: ['mount_point'],
    });
  });

  it('falls back to dimension when nothing is selected', () => {
    expect(buildGrouping([])).toEqual({ group_by: ['dimension'], group_by_label: [] });
    expect(buildGrouping(undefined)).toEqual({ group_by: ['dimension'], group_by_label: [] });
  });
});
