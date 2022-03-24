import { AppInfo } from './AppInfo';
import { useAllApps } from '../api';
import useMySuperFunction from '../api/all-app';

export const AppList = (): JSX.Element => {
  const { data, isLoading } = useAllApps();
  if (isLoading) {
    return <span>Loading apps.....</span>;
  }
  return (
    <div>
      <h3>List of registered apps in fusion</h3>
      {data?.map((app) => (
        <AppInfo key={app.key} app={app} />
      ))}
    </div>
  );
};
