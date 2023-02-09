import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';

import { PersonProvider } from '@equinor/fusion-react-person';
import { usePersonResolver } from './api/usePersonResolver';

/**
 * @constant queryClient created new query client
 */
const queryClient = new QueryClient();

/**
 *
 * @returns Add React Router and ReactDev tool
 * React Router @see (@link https://reactrouterdotcom.fly.dev/docs/en/v6/getting-started/installation)
 * React Query @see (@link https://react-query.tanstack.com/quick-start)
 */
export const AppComponent = (): JSX.Element => {
  const personResolver = usePersonResolver();

  return (
    <BrowserRouter>
      <PersonProvider resolve={personResolver}>
        <QueryClientProvider client={queryClient}>
          <Router />
          <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
      </PersonProvider>
    </BrowserRouter>
  );
};

export default AppComponent;
