import { useHttpClient } from '@equinor/fusion-framework-react-app/hooks';
import type { IHttpClient, FetchRequestInit } from '@equinor/fusion-framework-react-app/hooks/http';
import { useQuery } from 'react-query';
import { App } from '../types';
import { useMemo } from 'react';
import AppComponent from '../App';

import { QueryKeys } from '../api/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//check for error
const selector = <T extends any>(x: Response): Promise<T> => {
  return x.json();
};

const appSelector = async (x: Response): Promise<Record<string, App>> => {
  const response = await selector<Array<App>>(x);
  const result = response.reduce((acc, current) => {
    return Object.assign(acc, { [current.key]: AppComponent });
  }, {});
  return result;
};

/**
 * get all registered app from the portal
 */
export const useAllApps = () => {
  /** use the configured HttpClient which is configured by the `portal` key */
  const client = useHttpClient('portal');
  /** memorize the callback function for executing the query  */
  const fn = useMemo(() => getAllApps(client), [client]);
  return useQuery(QueryKeys.GetAllApps, ({ signal }) => fn({ signal, selector }));
};

const getAllApps =
  (client: IHttpClient) =>
  (init: FetchRequestInit): Promise<App[]> => {
    return client.fetchAsync('api/apps', init) as Promise<App[]>;
  };

export default useAllApps;
