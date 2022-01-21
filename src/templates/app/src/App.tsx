import { useEffect } from 'react';
import { useCurrentUser } from '@equinor/fusion';

import useStyle from './App.style';
// import { useHttpClient } from '@equinor/fusion-framework-react';
// import type { HttpClient } from '@equinor/fusion-framework/services';

export const App = (): JSX.Element | null => {
  console.log(1, 'starting app');
  const currentUser = useCurrentUser();
  // @ts-ignore
  // console.log(currentUser, window.Fusion.services.auth.client.account);

  // const styles = useStyle();

  // const client = useHttpClient('portal');
  // console.log(10, client);

  // useEffect(() => {
  //   const sub = client.fetch('/api/apps').subscribe({
  //     next: (result: any) => console.log(result),
  //     error: (err: any) => console.error(err),
  //   });
  //   return () => sub.unsubscribe();
  // }, [client]);

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <h1>Oh hello there, {currentUser.fullName}</h1>
    </div>
  );
};

export default App;
