import { renderLegend } from './legend';

const labels = { node: 'plaka-parent', mount_point: '/', filesystem: 'ext4' };

describe('renderLegend', () => {
  it('replaces a label token with its value', () => {
    expect(renderLegend('{{node}}', 'used', labels)).toBe('plaka-parent');
  });

  it('renders several tokens mixed with literal text', () => {
    expect(renderLegend('{{node}} - {{mount_point}}', 'used', labels)).toBe('plaka-parent - /');
  });

  it('exposes the series name as {{name}}', () => {
    expect(renderLegend('{{name}} on {{node}}', 'used', labels)).toBe('used on plaka-parent');
  });

  it('tolerates padding inside the braces', () => {
    expect(renderLegend('{{ node }}', 'used', labels)).toBe('plaka-parent');
  });

  it('resolves an unknown token to an empty string', () => {
    expect(renderLegend('{{node}}/{{missing}}', 'used', labels)).toBe('plaka-parent/');
  });

  it('returns undefined when no legend is set, so Grafana keeps naming the series', () => {
    expect(renderLegend(undefined, 'used', labels)).toBeUndefined();
    expect(renderLegend('', 'used', labels)).toBeUndefined();
    expect(renderLegend('   ', 'used', labels)).toBeUndefined();
  });

  it('falls back to the series name when the template resolves to nothing', () => {
    expect(renderLegend('{{missing}}', 'used', labels)).toBe('used');
  });

  it('passes through a template with no tokens', () => {
    expect(renderLegend('disk usage', 'used', labels)).toBe('disk usage');
  });

  it('leaves a malformed token alone', () => {
    expect(renderLegend('{{node', 'used', labels)).toBe('{{node');
  });
});
