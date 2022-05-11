import { useFusionContext } from '@equinor/fusion';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { AppsPage } from './pages/AppsPage';
import { HomePage } from './pages/HomePage';
import { UserPage } from './pages/UserPage';
import { TablePage } from './pages/TablePage';
/**
 *
 * @returns Routes and Route for rendering different pages in React Router
 */
export const Router = (): JSX.Element => {
  /**
   * Routes is the parent that looks through all its children so it can find and render the best match for Route.
   * Route renders its element if there is a match with the Route and its path
   */
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/table" element={<TablePage />} />
      </Route>
    </Routes>
  );
};

export default Router;
