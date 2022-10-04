import { getBackendSrv } from '@grafana/runtime';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

type RequestParamType = {
  method: string;
  path: string;
  baseUrl: string;
  data?: { [key: string]: any };
};

const request = async ({ method, path, baseUrl, data }: RequestParamType) => {
  const result = await getBackendSrv().datasourceRequest({
    method,
    url: `${baseUrl}/base${path}`,
    data,
  });

  return result;
};

export const Get = async ({ path, baseUrl }: Pick<RequestParamType, 'path' | 'baseUrl'>) => {
  return await request({ method: 'GET', path, baseUrl });
};

export const Post = async ({ path, baseUrl, data }: Pick<RequestParamType, 'path' | 'baseUrl' | 'data'>) => {
  return await request({ method: 'POST', path, baseUrl, data });
};
