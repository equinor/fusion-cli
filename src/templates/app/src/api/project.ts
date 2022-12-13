import { useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

import { useHttpClient } from '@equinor/fusion-framework-react-app/http';

import type { FetchRequestInit, IHttpClient } from '@equinor/fusion-framework-react-app/http';

import { QueryKeys } from './constants';

const projectSelector = (response: Response) => response.json();

export const useOrgProject = (id?: string): UseQueryResult => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - @odinr fix this typing to any-string ;)
  const client = useHttpClient('org');
  const fn = useMemo(() => getOrgProject(client), [client]);
  return useQuery([QueryKeys.GetProject, id], ({ signal }) => {
    if (!id) return null;
    return fn(id, { signal, selector: projectSelector });
  });
};

const getOrgProject =
  (client: IHttpClient) =>
  (id: string, init?: FetchRequestInit): Promise<any> => {
    return client.fetchAsync(`/projects/${id}`, init) as Promise<any>;
  };
