import { AppInfo } from './AppInfo';
import { useAllApps } from '../api';
import useMySuperFunction from '../api/all-app';
import { useStyles } from './AppList.style';

export const AppList = (): JSX.Element => {
  const { data, isLoading } = useAllApps();
  const appStyle = useStyles();
  if (isLoading) {
    return <span>Loading apps...</span>;
  }
  return (
    <div className={appStyle.root}>
      <h2 className={appStyle.title}>List of registered apps in fusion</h2>
      {data?.map((app) => (
        <AppInfo key={app.key} app={app} />
      ))}
    </div>
  );
};
