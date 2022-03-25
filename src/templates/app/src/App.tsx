import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';

const queryClient = new QueryClient();

export const AppComponent = (): JSX.Element => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Router />
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppComponent;
