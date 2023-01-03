import { useHistory } from '@equinor/fusion';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useRoutes, RouteObject, matchPath, useLocation } from 'react-router-dom';

import Icon from '@equinor/fusion-react-icon';

import Layout from './Layout';
import { ContextPage, HomePage, QueryPage, TablePage, UserPage } from './pages';

type Pages = RouteObject & { name: string; title?: string; icon: JSX.Element };

export const pages: Pages[] = [
  {
    name: 'Home',
    index: true,
    element: <HomePage />,
    icon: <Icon icon="home" />,
  },
  { name: 'Query', path: 'query', element: <QueryPage />, icon: <Icon icon="apps" /> },
  { name: 'Table', path: 'table', element: <TablePage />, icon: <Icon icon="table_chart" /> },
  { name: 'User', path: 'user', element: <UserPage />, icon: <Icon icon="account_circle" /> },
  { name: 'Context', path: 'context', element: <ContextPage />, icon: <Icon icon="donut_outlined" /> },
];

export const useCurrentPage = (): Pages | undefined => {
  const { pathname } = useLocation();
  return useMemo(() => pages.find((page) => !!matchPath({ path: page.path ?? '/' }, pathname)), [pathname]);
};

export const useNavHack = (): {
  isPortal: boolean;
  isAppPath: (pathname: string) => boolean | RegExpMatchArray | null;
  basename: string;
} => {
  /** since the portal has done routing before the app renders, check the path */
  const [isPortal] = useState(!!window.location.pathname.match(/^\/?apps/));
  const [basename] = useState(isPortal ? '/apps/test-app' : '/');
  const isAppPath = useCallback(
    (pathname: string) => !isPortal || (isPortal && pathname.match(basename)),
    [isPortal, basename]
  );
  return { isPortal, isAppPath, basename };
};

/**
 *
 * @returns Routes and Route for rendering different pages in React Router
 */
export const Router = (): JSX.Element | null => {
  const fusionHistory = useHistory();
  const navigate = useNavigate();
  const { basename, isAppPath } = useNavHack();
  useEffect(
    () =>
      fusionHistory.listen((e) => {
        /** hack since app is unloaded after navigation outside app */
        if (isAppPath(e.pathname)) {
          /** hack to remove app prefix from path */
          e.pathname = e.pathname.replace(basename, '');
          navigate(e);
        }
      }),
    [fusionHistory, navigate, isAppPath, basename]
  );
  return useRoutes([{ path: '/:contextId/', element: <Layout />, children: pages }]);
};

export default Router;
