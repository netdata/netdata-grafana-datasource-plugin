import React from 'react';
import { Space } from '../types/space.interface';
import { Get } from 'shared/utils/request';
import { Dropdown } from 'shared/types/dropdown.interface';

export const getSpaces = async (baseUrl: string) => {
  const response = await Get({ path: '/v2/spaces', baseUrl });
  return response?.data as Space[];
};

export const useFetchSpaces = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [spaces, setSpaces] = React.useState<Dropdown[]>([]);

  React.useEffect(() => {
    try {
      const fetchData = async () => {
        setIsError(false);

        try {
          const result = await getSpaces(baseUrl);
          setSpaces(result.map((s) => ({ label: s.name, value: s.id })));
        } catch (error) {
          setIsError(true);
        }
      };

      fetchData();
    } catch (error) {
      console.log('ERROR (useFetchSpaces): ', error);
      setIsError(true);
    }
  }, [baseUrl]);

  return { isError, spaces };
};
