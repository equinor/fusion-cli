import { AppList } from '../components/AppList';
import { Navigation } from '../components/Navigation';
import { useStyles } from '../components/Navigation.style';

export const AppsPage = (): JSX.Element => {
  const styles = useStyles();
  return (
    <div className={styles.flex}>
      <Navigation />
      <AppList />;
    </div>
  );
};
