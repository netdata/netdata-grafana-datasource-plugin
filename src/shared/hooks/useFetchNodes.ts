import React from 'react';
import { Post } from 'shared/utils/request';

export const getNodes = async (spaceId: string, roomId: string, baseUrl: string) => {
  const response = await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/nodes`,
    baseUrl,
    data: {
      scope: {
        nodes: [],
      },
    },
  });
  return response?.data?.nodes;
};

export const useFetchNodes = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [nodes, setNodes] = React.useState([]);

  const fetchNodes = React.useCallback(
    async (spaceId: string, roomId: string) => {
      setIsError(false);

      try {
        const result = await getNodes(spaceId, roomId, baseUrl);
        setNodes(result);
      } catch (error) {
        console.log('ERROR (useFetchNodes): ', error);
        setIsError(true);
      }
    },
    [baseUrl]
  );

  return {
    isError,
    nodes,
    fetchNodes,
  };
};
