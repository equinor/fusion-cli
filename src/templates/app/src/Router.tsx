import { useFusionContext } from '@equinor/fusion';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { AppsPage } from './pages/AppsPage';
import { HomePage } from './pages/HomePage';

export const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/apps" element={<AppsPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
