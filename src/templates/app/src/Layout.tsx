import { Outlet } from 'react-router-dom';

export const Layout = (): JSX.Element => (
  <div style={{ height: '100%' }}>
    <Outlet />
  </div>
);

export default Layout;
