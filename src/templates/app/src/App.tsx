import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';

const queryClient = new QueryClient();

export const AppComponent = (): JSX.Element => {
  // const framework = useFramework();
  // const modules = useModuleContext();
  // const account = useCurrentUser();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Router />
        {/* <div>
          <h3>Current user</h3>
          <code>
            <pre>{JSON.stringify(account, null, 4)}</pre>
          </code>
          <h3>Registered modules in Framework</h3>
          <ul>
            {Object.keys(framework.modules).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3>Registered modules in App</h3>
          <ul>
            {Object.keys(modules).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h3>List of registered apps in fusion</h3>
          <AppList />
        </div> */}
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppComponent;
