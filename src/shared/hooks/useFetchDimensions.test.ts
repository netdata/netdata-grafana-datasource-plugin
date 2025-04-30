import { renderHook } from '@testing-library/react-hooks';
import * as hooks from './useFetchDimensions';

const baseUrl = '/base';

const dataMock: Promise<any> = Promise.resolve({
  'apps.cpu': {
    chartLabels: {
      _collect_module: ['_none_'],
      _collect_plugin: ['apps.plugin'],
      _instance_family: ['cpu'],
    },
    chartType: 'stacked',
    context: 'apps.cpu',
    dimensions: {
      agent_sd: {
        id: 'agent_sd',
        name: 'agent_sd',
      },
      alertmanager: {
        id: 'alertmanager',
        name: 'alertmanager',
      },
      'apps.plugin': {
        id: 'apps.plugin',
        name: 'apps.plugin',
      },
      bash: {
        id: 'bash',
        name: 'bash',
      },
      'cloud-accounts-service': {
        id: 'cloud-accounts-service',
        name: 'cloud-accounts-service',
      },
      'cloud-agent-data-ctrl-service': {
        id: 'cloud-agent-data-ctrl-service',
        name: 'cloud-agent-data-ctrl-service',
      },
      'cloud-agent-service': {
        id: 'cloud-agent-service',
        name: 'cloud-agent-service',
      },
      'cloud-custom-dashboard-service': {
        id: 'cloud-custom-dashboard-service',
        name: 'cloud-custom-dashboard-service',
      },
      'cloud-iam-agent-service': {
        id: 'cloud-iam-agent-service',
        name: 'cloud-iam-agent-service',
      },
      'cloud-iam-user-service': {
        id: 'cloud-iam-user-service',
        name: 'cloud-iam-user-service',
      },
      'cloud-node-mqtt-input-service': {
        id: 'cloud-node-mqtt-input-service',
        name: 'cloud-node-mqtt-input-service',
      },
      'cloud-node-mqtt-output-service': {
        id: 'cloud-node-mqtt-output-service',
        name: 'cloud-node-mqtt-output-service',
      },
      'cloud-nodes-service': {
        id: 'cloud-nodes-service',
        name: 'cloud-nodes-service',
      },
      'cloud-spaceroom-service': {
        id: 'cloud-spaceroom-service',
        name: 'cloud-spaceroom-service',
      },
      containerd: {
        id: 'containerd',
        name: 'containerd',
      },
      'containerd-shim': {
        id: 'containerd-shim',
        name: 'containerd-shim',
      },
      dockerd: {
        id: 'dockerd',
        name: 'dockerd',
      },
      envoy: {
        id: 'envoy',
        name: 'envoy',
      },
      'go.d.plugin': {
        id: 'go.d.plugin',
        name: 'go.d.plugin',
      },
      grafana: {
        id: 'grafana',
        name: 'grafana',
      },
      gunicorn: {
        id: 'gunicorn',
        name: 'gunicorn',
      },
      haproxy: {
        id: 'haproxy',
        name: 'haproxy',
      },
      'haproxy-ingress': {
        id: 'haproxy-ingress',
        name: 'haproxy-ingress',
      },
      'kube-proxy': {
        id: 'kube-proxy',
        name: 'kube-proxy',
      },
      'kube-state-metrics': {
        id: 'kube-state-metrics',
        name: 'kube-state-metrics',
      },
      kubelet: {
        id: 'kubelet',
        name: 'kubelet',
      },
      loki: {
        id: 'loki',
        name: 'loki',
      },
      'metrics-server': {
        id: 'metrics-server',
        name: 'metrics-server',
      },
      mongod: {
        id: 'mongod',
        name: 'mongod',
      },
      netdata: {
        id: 'netdata',
        name: 'netdata',
      },
      nginx: {
        id: 'nginx',
        name: 'nginx',
      },
      node_exporter: {
        id: 'node_exporter',
        name: 'node_exporter',
      },
      other: {
        id: 'other',
        name: 'other',
      },
      pomerium: {
        id: 'pomerium',
        name: 'pomerium',
      },
      'prometheus-adapter': {
        id: 'prometheus-adapter',
        name: 'prometheus-adapter',
      },
      'prometheus-pushgateway': {
        id: 'prometheus-pushgateway',
        name: 'prometheus-pushgateway',
      },
      'prometheus-server': {
        id: 'prometheus-server',
        name: 'prometheus-server',
      },
      promtail: {
        id: 'promtail',
        name: 'promtail',
      },
      python: {
        id: 'python',
        name: 'python',
      },
      'python.d.plugin': {
        id: 'python.d.plugin',
        name: 'python.d.plugin',
      },
      redis: {
        id: 'redis',
        name: 'redis',
      },
      sshd: {
        id: 'sshd',
        name: 'sshd',
      },
      traefik: {
        id: 'traefik',
        name: 'traefik',
      },
      vernemq: {
        id: 'vernemq',
        name: 'vernemq',
      },
    },
    family: 'cpu',
    firstEntry: 1662555061,
    lastEntry: 1662969591,
    module: '_none_',
    nodeIDs: [
      '3d36c8ea-49dc-4191-9010-9a7862fe472d',
      '05ce83ea-f62e-4839-868e-90bc81a7114a',
      '113074c4-4575-4feb-8abd-7c077b9c5e96',
      '2475156b-54a1-4d2f-99d6-7e5f816e5317',
      'ca1c7695-88e4-4124-b54f-804b297e6e9d',
      '972c5e17-a341-4aa7-9598-31fd0aef8e26',
      '113074c4-4575-4feb-8abd-7c077b9c5e96',
      '74ffad89-08c2-42f4-baa3-c653d189b5dc',
      'ca1c7695-88e4-4124-b54f-804b297e6e9d',
      'ca1c7695-88e4-4124-b54f-804b297e6e9d',
      '3bd6c73f-888e-4da5-bbe6-6ef0baf9d939',
      '05ce83ea-f62e-4839-868e-90bc81a7114a',
      '054b5fee-a743-473c-b0d2-8d394c43a333',
      '3d36c8ea-49dc-4191-9010-9a7862fe472d',
      '2f4360eb-5969-4603-b6d1-5bb22e2334e6',
      '113074c4-4575-4feb-8abd-7c077b9c5e96',
      '25fe7213-4ff2-44d3-8e81-07b5747b502b',
      '2f4360eb-5969-4603-b6d1-5bb22e2334e6',
      '2475156b-54a1-4d2f-99d6-7e5f816e5317',
      '0fc6e555-1f75-49d9-bd35-70321f6dd2e6',
      '3bd6c73f-888e-4da5-bbe6-6ef0baf9d939',
      '9535c5e7-eafd-4889-8097-844e536628a6',
      '972c5e17-a341-4aa7-9598-31fd0aef8e26',
      '054b5fee-a743-473c-b0d2-8d394c43a333',
      '25fe7213-4ff2-44d3-8e81-07b5747b502b',
      '74ffad89-08c2-42f4-baa3-c653d189b5dc',
      '3bd6c73f-888e-4da5-bbe6-6ef0baf9d939',
      '9535c5e7-eafd-4889-8097-844e536628a6',
      '2f4360eb-5969-4603-b6d1-5bb22e2334e6',
      '9535c5e7-eafd-4889-8097-844e536628a6',
      '972c5e17-a341-4aa7-9598-31fd0aef8e26',
      '0fc6e555-1f75-49d9-bd35-70321f6dd2e6',
      '05ce83ea-f62e-4839-868e-90bc81a7114a',
      '25fe7213-4ff2-44d3-8e81-07b5747b502b',
      '2475156b-54a1-4d2f-99d6-7e5f816e5317',
      '3d36c8ea-49dc-4191-9010-9a7862fe472d',
      '054b5fee-a743-473c-b0d2-8d394c43a333',
      '0fc6e555-1f75-49d9-bd35-70321f6dd2e6',
      '74ffad89-08c2-42f4-baa3-c653d189b5dc',
    ],
    plugin: 'apps.plugin',
    priority: 20001,
    title: 'Apps CPU Time (100% = 1 core)',
    units: 'percentage',
  },
});

describe('useFetchDimensions', () => {
  it('return correct data', async () => {
    jest.spyOn(hooks, 'getDimensions').mockImplementation(() => dataMock);

    const { result, waitFor } = renderHook(() => hooks.useFetchDimensions(baseUrl));

    await result.current.fetchDimensions({
      spaceId: 'spaceId',
      roomId: 'roomId',
      contextId: 'apps.cpu',
      nodeIDs: ['nodeIDs'],
    });

    await waitFor(() => result.current.allDimensions.length > 0);

    expect(result.current.allDimensions).toBeDefined();
    expect(result.current.allDimensions).toEqual([
      { label: 'agent_sd', value: 'agent_sd' },
      { label: 'alertmanager', value: 'alertmanager' },
      { label: 'apps.plugin', value: 'apps.plugin' },
      { label: 'bash', value: 'bash' },
      { label: 'cloud-accounts-service', value: 'cloud-accounts-service' },
      { label: 'cloud-agent-data-ctrl-service', value: 'cloud-agent-data-ctrl-service' },
      { label: 'cloud-agent-service', value: 'cloud-agent-service' },
      { label: 'cloud-custom-dashboard-service', value: 'cloud-custom-dashboard-service' },
      { label: 'cloud-iam-agent-service', value: 'cloud-iam-agent-service' },
      { label: 'cloud-iam-user-service', value: 'cloud-iam-user-service' },
      { label: 'cloud-node-mqtt-input-service', value: 'cloud-node-mqtt-input-service' },
      { label: 'cloud-node-mqtt-output-service', value: 'cloud-node-mqtt-output-service' },
      { label: 'cloud-nodes-service', value: 'cloud-nodes-service' },
      { label: 'cloud-spaceroom-service', value: 'cloud-spaceroom-service' },
      { label: 'containerd', value: 'containerd' },
      { label: 'containerd-shim', value: 'containerd-shim' },
      { label: 'dockerd', value: 'dockerd' },
      { label: 'envoy', value: 'envoy' },
      { label: 'go.d.plugin', value: 'go.d.plugin' },
      { label: 'grafana', value: 'grafana' },
      { label: 'gunicorn', value: 'gunicorn' },
      { label: 'haproxy', value: 'haproxy' },
      { label: 'haproxy-ingress', value: 'haproxy-ingress' },
      { label: 'kube-proxy', value: 'kube-proxy' },
      { label: 'kube-state-metrics', value: 'kube-state-metrics' },
      { label: 'kubelet', value: 'kubelet' },
      { label: 'loki', value: 'loki' },
      { label: 'metrics-server', value: 'metrics-server' },
      { label: 'mongod', value: 'mongod' },
      { label: 'netdata', value: 'netdata' },
      { label: 'nginx', value: 'nginx' },
      { label: 'node_exporter', value: 'node_exporter' },
      { label: 'other', value: 'other' },
      { label: 'pomerium', value: 'pomerium' },
      { label: 'prometheus-adapter', value: 'prometheus-adapter' },
      { label: 'prometheus-pushgateway', value: 'prometheus-pushgateway' },
      { label: 'prometheus-server', value: 'prometheus-server' },
      { label: 'promtail', value: 'promtail' },
      { label: 'python', value: 'python' },
      { label: 'python.d.plugin', value: 'python.d.plugin' },
      { label: 'redis', value: 'redis' },
      { label: 'sshd', value: 'sshd' },
      { label: 'traefik', value: 'traefik' },
      { label: 'vernemq', value: 'vernemq' },
    ]);

    expect(result.current.filters).toEqual({
      'No filter': [],
      _collect_module: ['_none_'],
      _collect_plugin: ['apps.plugin'],
      _instance_family: ['cpu'],
    });
    expect(result.current.groupingByList).toEqual([
      { label: 'dimension', value: 'dimension' },
      { label: 'node', value: 'node' },
      { label: 'instance', value: 'instance' },
      { label: '_collect_module', value: '_collect_module' },
      { label: '_collect_plugin', value: '_collect_plugin' },
      { label: '_instance_family', value: '_instance_family' },
    ]);
    expect(result.current.units).toEqual('percentage');
  });
});
