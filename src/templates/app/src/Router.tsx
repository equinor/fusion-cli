import { useMemo } from 'react';

import { useRoutes, RouteObject, matchPath, useLocation } from 'react-router-dom';

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

export const useCurrentPage = () => {
  const { pathname } = useLocation();
  return useMemo(() => pages.find((page) => !!matchPath({ path: page.path ?? '/' }, pathname)), [pathname]);
};

/**
 *
 * @returns Routes and Route for rendering different pages in React Router
 */
export const Router = () => {
  /**
   * Routes is the parent that looks through all its children so it can find and render the best match for Route.
   * Route renders its element if there is a match with the Route and its path
   */

  return useRoutes([{ path: '/:contextId/', element: <Layout />, children: pages }]);
};

export default Router;
