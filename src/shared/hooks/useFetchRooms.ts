import { Dropdown } from './../types/dropdown.interface';
import React from 'react';
import { Get } from 'shared/utils/request';

export const getRooms = async (spaceId: string, baseUrl: string) => {
  const response = await Get({ path: `/v2/spaces/${spaceId}/rooms`, baseUrl });
  return response?.data;
};

export const useFetchRooms = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [rooms, setRooms] = React.useState<Dropdown[]>([]);

  const fetchRooms = React.useCallback(
    async (spaceId: string) => {
      setIsError(false);

      try {
        const result = await getRooms(spaceId, baseUrl);
        setRooms(result?.map((r: any) => ({ label: r.name, value: r.id })));
      } catch (error) {
        console.log('ERROR (useFetchRooms): ', error);
        setIsError(true);
      }
    },
    [baseUrl]
  );

  return { isError, rooms, fetchRooms };
};
