import { AppInfo } from './AppInfo';
import { useAllApps } from '../api';
import useMySuperFunction from '../api/all-app';
import { useStyles } from './AppList.style';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';

export const AppList = (): JSX.Element => {
  const { data, isLoading } = useAllApps();
  const appStyle = useStyles();
  const navigate = useNavigate();
  const breadcrumbs = (): BreadcrumbItemProps[] => {
    return [
      {
        onClick: () => {
          navigate("/");
        },
        name: 'Home',
      },
      {
        name: 'Apps',
      },
    ];
  };

  if (isLoading) {
    return <span>Loading apps...</span>;
  }
  return (
    <div className={appStyle.root}>
      <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumbs()} />
      <h2 className={appStyle.title}>List of registered apps in fusion</h2>
      {data?.map((app) => (
        <AppInfo key={app.key} app={app} />
      ))}
    </div>
  );
};
