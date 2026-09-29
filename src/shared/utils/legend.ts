import type { Labels } from '@grafana/data';

const TOKEN = /\{\{\s*([^{}]+?)\s*\}\}/g;

/**
 * Renders a legend template for one series. `{{name}}` is the name the API returned, every other
 * token is a label key; unknown tokens resolve to an empty string, as in other Grafana data sources.
 *
 * Returns undefined when no template is set, so the caller can leave the series unnamed and let
 * Grafana apply its own naming and cross-query disambiguation.
 */
export const renderLegend = (legend: string | undefined, name: string, labels: Labels): string | undefined => {
  if (!legend?.trim()) {
    return undefined;
  }

  const rendered = legend.replace(TOKEN, (_token, key: string) => (key === 'name' ? name : labels[key] ?? '')).trim();

  // a template of nothing but unknown tokens would otherwise blank the legend out
  return rendered || name;
};
