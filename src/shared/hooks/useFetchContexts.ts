import { Dropdown } from './../types/dropdown.interface';
import React from 'react';
import { Get } from 'shared/utils/request';

export const getContexts = async (spaceId: string, roomId: string, baseUrl: string) => {
  const response = await Get({ path: `/v2/spaces/${spaceId}/rooms/${roomId}/contexts`, baseUrl });
  return response?.data?.results as string[];
};

export const useFetchContexts = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [contexts, setContexts] = React.useState<Dropdown[]>([]);

  const fetchContexts = React.useCallback(
    async (spaceId: string, roomId: string) => {
      setIsError(false);

      try {
        const result = await getContexts(spaceId, roomId, baseUrl);
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
