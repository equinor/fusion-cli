import { createStyles, makeStyles } from '@equinor/fusion-react-styles';
// import { useLocation } from 'react-router';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const useStyle = makeStyles(
  (theme) =>
    createStyles({
      root: {
        display: 'flex',
        height: '100%',
        width: '100%',
      },
      content: {
        paddingTop: theme.spacing.comfortable.medium.getVariable('padding'),
        paddingBottom: theme.spacing.comfortable.medium.getVariable('padding'),
        flex: '1 1 100%',
      },
    }),
  { name: 'layout' }
);

export const Layout = (): JSX.Element => {
  const style = useStyle();
  // const { pathname } = useLocation();
  return (
    <div className={style.root}>
      <Navigation />
      <section className={style.content}>
        <Outlet />
      </section>
    </div>
  );
};

export default Layout;
