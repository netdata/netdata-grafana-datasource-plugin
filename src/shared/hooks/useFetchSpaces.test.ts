import { renderHook } from '@testing-library/react-hooks';
import * as hooks from './useFetchSpaces';

const baseUrl = '/base';

const dataMock: Promise<any> = Promise.resolve([
  {
    id: 'd7574e05-c430-4b7a-b92d-987b8f3372a4',
    slug: 'netdata-cloud-stg',
    name: 'Netdata Cloud STG',
    description: null,
    iconURL: null,
    state: 'current',
    createdAt: '2020-07-23T09:16:10.556Z',
    isNG: true,
  },
  {
    id: 'b22a95cb-f340-478f-8ebd-88e1b4e57836',
    slug: 'michael-space',
    name: 'Michael space',
    description: null,
    iconURL: null,
    state: 'current',
    createdAt: '2022-06-01T14:31:23.551Z',
    isNG: true,
  },
]);

describe('useFetchSpaces', () => {
  it('return correct data', async () => {
    jest.spyOn(hooks, 'getSpaces').mockImplementation(() => dataMock);

    const { result, waitFor } = renderHook(() => hooks.useFetchSpaces(baseUrl));

    await waitFor(() => result.current.spaces.length > 0);

    expect(result.current.spaces).toBeDefined();
    expect(result.current.spaces).toEqual([
      { value: 'd7574e05-c430-4b7a-b92d-987b8f3372a4', label: 'Netdata Cloud STG' },
      {
        value: 'b22a95cb-f340-478f-8ebd-88e1b4e57836',
        label: 'Michael space',
      },
    ]);
  });
});
