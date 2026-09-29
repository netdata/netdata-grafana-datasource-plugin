import { normalizeGroupBy } from './transformations';

describe('normalizeGroupBy', () => {
  it('wraps the legacy single-string form', () => {
    expect(normalizeGroupBy('node')).toEqual(['node']);
  });

  it('passes an array through', () => {
    expect(normalizeGroupBy(['node', 'mount_point'])).toEqual(['node', 'mount_point']);
  });

  it('returns an empty list when unset', () => {
    expect(normalizeGroupBy(undefined)).toEqual([]);
    expect(normalizeGroupBy('')).toEqual([]);
  });
});
