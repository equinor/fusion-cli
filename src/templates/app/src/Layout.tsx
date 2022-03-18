import { Outlet } from 'react-router-dom';

export const Layout = (): JSX.Element => (
  <div>
    <Outlet />
  </div>
);

export default Layout;
