import { useHttpClient } from '@equinor/fusion-framework-react-app/hooks';
import type { IHttpClient, FetchRequestInit } from '@equinor/fusion-framework-react-app/hooks/http';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { AppInfo } from './AppInfo';
import { App } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selector = <T extends any>(x: Response): Promise<T> => {
  return x.json();
};

/**
 * get all registered app from the portal
 */
const useAllApps = () => {
  /** use the configured HttpClient which is configured by the `portal` key */
  const client = useHttpClient('portal');
  /** memorize the callback function for executing the query  */
  const fn = useMemo(() => getAllApps(client), [client]);
  return useQuery('all_apps123', ({ signal }) => fn({ signal, selector }));
};

const getAllApps =
  (client: IHttpClient) =>
  (init: FetchRequestInit): Promise<App[]> => {
    return client.fetchAsync('api/apps', init) as Promise<App[]>;
  };

export const AppList = (): JSX.Element => {
  const { data, isLoading } = useAllApps();
  if (isLoading) {
    return <span>Loading apps.....</span>;
  }

  return (
    <div>
      <h3>List of registered apps in fusion</h3>
      {data?.map((app) => (
        <AppInfo key={app.key} app={app} />
      ))}
    </div>
  );
};
