import { renderHook } from '@testing-library/react-hooks';
import * as hooks from './useFetchRooms';

const baseUrl = '/base';

const dataMock: Promise<any> = Promise.resolve([
  {
    id: '8ff5f814-5739-45bb-8da9-7fbd41b18cb0',
    slug: 'demo-sites',
    name: 'demo-sites',
    description: 'Demo Sites',
    untouchable: false,
    private: false,
    createdAt: '2021-05-19T16:06:34.336397Z',
    isMember: true,
    node_count: 4,
    member_count: 47,
    permissions: [
      'room:ChangeName',
      'room:ChangeDescription',
      'room:LeaveRoom',
      'room:AddExistingNode',
      'room:RemoveNode',
    ],
  },
  {
    id: '9e949183-e2a6-44a5-88df-deb4f3f4271e',
    slug: 'k8s-prd',
    name: 'k8s-prd',
    description: 'Nodes running in PRD k8s',
    untouchable: false,
    private: false,
    createdAt: '2021-11-17T11:34:44.181579Z',
    isMember: true,
    node_count: 19,
    member_count: 51,
    permissions: [
      'room:ChangeName',
      'room:ChangeDescription',
      'room:LeaveRoom',
      'room:AddExistingNode',
      'room:RemoveNode',
    ],
  },
  {
    id: 'cd1196a1-c06e-4680-8c9b-6c323e9b427e',
    slug: 'all-nodes',
    name: 'All nodes',
    description: '',
    untouchable: true,
    private: false,
    createdAt: '2020-07-23T09:10:08.6429Z',
    isMember: true,
    node_count: 33,
    member_count: 51,
    permissions: [
      'room:ChangeName',
      'room:ChangeDescription',
      'room:LeaveRoom',
      'room:AddExistingNode',
      'room:RemoveNode',
    ],
  },
]);

describe('useFetchRooms', () => {
  it('return correct data', async () => {
    jest.spyOn(hooks, 'getRooms').mockImplementation(() => dataMock);

    const { result, waitFor } = renderHook(() => hooks.useFetchRooms(baseUrl));

    await result.current.fetchRooms('spaceId');

    await waitFor(() => result.current.rooms.length > 0);

    expect(result.current.rooms).toBeDefined();
    expect(result.current.rooms).toEqual([
      { value: '8ff5f814-5739-45bb-8da9-7fbd41b18cb0', label: 'demo-sites' },
      {
        value: '9e949183-e2a6-44a5-88df-deb4f3f4271e',
        label: 'k8s-prd',
      },
      {
        value: 'cd1196a1-c06e-4680-8c9b-6c323e9b427e',
        label: 'All nodes',
      },
    ]);
  });
});
