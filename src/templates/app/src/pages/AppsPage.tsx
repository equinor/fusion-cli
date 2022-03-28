import { AppList } from '../components/AppList';
import { Navigation } from '../components/Navigation';
import useNavStyles from "../components/Navigation.style";
import useStyles from '../App.style';

export const AppsPage = (): JSX.Element => {
  const navStyles = useNavStyles();
  const styles = useStyles();
  return (
    <div className={navStyles.flex}>
      <Navigation />
      <div className={styles.container}>
        <AppList />
      </div>
    </div>
  );
};
