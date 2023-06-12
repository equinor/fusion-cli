import { IHttpClient } from '@equinor/fusion-framework-module-http';
import { useFramework } from '@equinor/fusion-framework-react';
import { Query } from '@equinor/fusion-query';
import { PersonDetails, PersonPresence, PersonResolver } from '@equinor/fusion-wc-person';
import { useMemo, useState } from 'react';

const createPersonClient = (client: IHttpClient) => {
  // TODO - good cache amount? 3min?
  const expire = 3 * 60 * 1000;
  const queryDetails = new Query({
    expire,
    queueOperator: 'merge',
    key: (azureId) => azureId,
    client: {
      fn: async (azureId: string) => {
        const user = await client.json<PersonDetails>(`/persons/${azureId}?api-version=4.0&$expand=positions,manager`);

        try {
          const image = await client.json<string>(`/persons/${azureId}/photo?api-version=1.0`);
          user.pictureSrc = image;
        } catch (error) {
          user.pictureSrc = '/images/profiles/';
        }

        return user;
      },
    },
  });

  const queryPresence = new Query({
    expire,
    queueOperator: 'merge',
    key: (azureId) => azureId,
    client: {
      fn: (azureId: string) => client.json<PersonPresence>(`/persons/${azureId}/presence?api-version=1.0`),
    },
  });

  return {
    getDetails: (azureId: string) => queryDetails.queryAsync(azureId).then((x) => x.value),
    getPresence: (azureId: string) => queryPresence.queryAsync(azureId).then((x) => x.value),
  };
};

export const usePersonResolver = (): PersonResolver => {
  const [resolver, setResolver] = useState<PersonResolver | undefined>(undefined);
  const framework = useFramework();
  useMemo(() => {
    framework.modules.serviceDiscovery
      .createClient('people')
      .then((httpClient) => createPersonClient(httpClient))
      .then(setResolver);
  }, [framework]);
  return resolver as PersonResolver;
};
