import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  spaceId?: string;
  roomId?: string;
  contextId?: string;
  nodes?: string[];
  groupBy?: string;
  method?: string;
  dimensions?: string[];
  group?: string;
  filterBy?: string;
  filterValue?: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {}
/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiToken?: string;
}
