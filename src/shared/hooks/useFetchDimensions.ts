import React from 'react';
import { GroupByList } from 'shared/constants';
import { Dropdown } from 'shared/types/dropdown.interface';
import { Post } from 'shared/utils/request';

export const getDimensions = async (
  spaceId: string,
  roomId: string,
  contextId: string,
  nodeIDs: string[],
  baseUrl: string
) => {
  const response = await Post({
    path: `/v2/spaces/${spaceId}/rooms/${roomId}/charts/${contextId}`,
    baseUrl,
    data: {
      filter: { nodeIDs },
    },
  });
  return response?.data?.results;
};

export const useFetchDimensions = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [allDimensions, setDimensions] = React.useState<any[]>([]);
  const [filters, setFilters] = React.useState<{ [key in string]: [] }>({});
  const [groupingByList, setGroupingByList] = React.useState<Dropdown[]>(GroupByList);
  const [units, setUnits] = React.useState('');

  const fetchDimensions = async ({ spaceId, roomId, contextId, nodeIDs }: any) => {
    setIsError(false);
    try {
      const result = await getDimensions(spaceId, roomId, contextId, nodeIDs, baseUrl);
      setUnits(result?.[contextId].units);
      setDimensions(Object.values(result?.[contextId]?.dimensions)?.map((c: any) => ({ label: c.name, value: c.id })));
      setFilters({ 'No filter': [], ...result?.[contextId]?.chartLabels });

      const groupByData = [
        ...GroupByList,
        ...Object.keys(result?.[contextId]?.chartLabels).map((g: any) => ({ label: g, value: g })),
      ];

      setGroupingByList(groupByData);
    } catch (error) {
      console.log('ERROR (useFetchDimensions): ', error);
      setIsError(true);
    }
  };

  return {
    isError,
    allDimensions,
    filters,
    groupingByList,
    units,
    fetchDimensions,
  };
};
