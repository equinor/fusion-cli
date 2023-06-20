import { AppInfo } from './AppInfo';
import { useAllApps } from '../api';
import useStyles from './AppList.style';
import useNavStyles from '../components/Navigation.style';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';

/**
 *
 * @returns List of all fusion registered applications from the portal
 */
export const AppList = (): JSX.Element => {
  /**
   * data and ability to check if the apps are loading
   */
  const { data, isLoading } = useAllApps();
  const appStyle = useStyles();
  const navigate = useNavigate();
  const navStyles = useNavStyles();
  const breadcrumbs = (): BreadcrumbItemProps[] => {
    return [
      {
        onClick: () => {
          navigate('/');
        },
        name: 'Home',
      },
      {
        name: 'Apps',
      },
    ];
  };
  /**
   * if the apps are loading
   */
  if (isLoading) {
    return (
      <>
        <div className={navStyles.breadcrumbs}>
          <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumbs()} />
        </div>
        <div className={appStyle.root}>
          <h4 className={appStyle.title}>Loading apps...</h4>
        </div>
      </>
    );
  }
  /**
   * if there is data, map it all with AppInfo component
   */
  return (
    <>
      <div className={navStyles.breadcrumbs}>
        <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumbs()} />
      </div>
      <div className={appStyle.root}>
        <h2 className={appStyle.title}>List of registered apps in fusion</h2>
        {Object.values(data ?? {}).map((app) => (
          <AppInfo key={app.key} app={app} />
        ))}
      </div>
    </>
  );
};
