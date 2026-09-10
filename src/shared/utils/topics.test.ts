import { chartDataTopic } from './topics';

describe('chartDataTopic', () => {
  it('scopes the topic per query', () => {
    expect(chartDataTopic('A')).toBe('CHART_DATA.A');
    expect(chartDataTopic('B')).toBe('CHART_DATA.B');
  });

  it('flattens refIds that would otherwise nest under another query topic', () => {
    // PubSub delivers CHART_DATA.A.B to subscribers of CHART_DATA.A
    expect(chartDataTopic('A.B')).toBe('CHART_DATA.A_B');
  });

  it('falls back when no refId is given', () => {
    expect(chartDataTopic(undefined)).toBe('CHART_DATA.unknown');
  });
});
