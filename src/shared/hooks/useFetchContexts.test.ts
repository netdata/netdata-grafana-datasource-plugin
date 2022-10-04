import { renderHook } from '@testing-library/react-hooks';
import * as hooks from './useFetchContexts';

const baseUrl = '/base';

const dataMock: Promise<any> = Promise.resolve([
  'anomaly_detection.anomaly_rate',
  'anomaly_detection.anomaly_rates',
  'anomaly_detection.detector_events',
]);

describe('useFetchContexts', () => {
  it('return correct data', async () => {
    jest.spyOn(hooks, 'getContexts').mockImplementation(() => dataMock);

    const { result, waitFor } = renderHook(() => hooks.useFetchContexts(baseUrl));

    await result.current.fetchContexts('spaceId', 'roomId');

    await waitFor(() => result.current.contexts.length > 0);

    expect(result.current.contexts).toBeDefined();
    expect(result.current.contexts).toEqual([
      { value: 'anomaly_detection.anomaly_rate', label: 'anomaly_detection.anomaly_rate' },
      {
        value: 'anomaly_detection.anomaly_rates',
        label: 'anomaly_detection.anomaly_rates',
      },
      {
        value: 'anomaly_detection.detector_events',
        label: 'anomaly_detection.detector_events',
      },
    ]);
  });
});
