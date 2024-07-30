import { Dropdown } from './../types/dropdown.interface';
import React from 'react';
import { Post } from 'shared/utils/request';

export const getContexts = async (spaceId: string, roomId: string, after: number, before: number, baseUrl: string) => {
  const response = await Post({
    path: `/v3/spaces/${spaceId}/rooms/${roomId}/contexts`,
    baseUrl,
    data: {
      scope: {
        contexts: ['*'],
        nodes: [],
      },
      selectors: {
        contexts: [],
        nodes: [],
      },
      window: {
        after,
        before,
      },
    },
  });
  const { contexts = {} } = response?.data || {};
  return Object.keys(contexts) as string[];
};

export const useFetchContexts = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [contexts, setContexts] = React.useState<Dropdown[]>([]);

  const fetchContexts = React.useCallback(
    async (spaceId: string, roomId: string, after: number, before: number) => {
      setIsError(false);

      try {
        const result = await getContexts(spaceId, roomId, after, before, baseUrl);
        setContexts(result.map((c) => ({ label: c, value: c })));
      } catch (error) {
        setIsError(true);
        console.log('ERROR (useFetchContexts): ', error);
      }
    },
    [baseUrl]
  );

  return { isError, contexts, fetchContexts };
};
