import { GroupByList } from 'shared/constants';

export const getDimensions = (dimensions: any) => {
  const { ids, names } = dimensions;
  if (!ids) {
    return [];
  }

  return ids.map((id: string, index: number) => ({ value: id, label: names[index] || id }));
};

export const defaultFilter = { 'No filter': [] };

export const getFilters = (labels: any[]) => {
  if (!labels?.length) {
    return defaultFilter;
  }

  return {
    ...defaultFilter,
    ...labels.reduce((acc: any, label: any) => {
      acc[label.id] = (label.vl || []).map((value: any) => value.id);
      return acc;
    }, {}),
  };
};

export const getGroupingByList = (labels: any[]) => {
  if (!labels?.length) {
    return GroupByList;
  }

  return [...GroupByList, ...labels.map((label: any) => ({ value: label.id, label: label.id }))];
};
