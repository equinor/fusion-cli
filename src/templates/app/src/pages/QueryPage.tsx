import { AppList } from '../components/AppList';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';
import List, { ListItem } from '@equinor/fusion-react-list';
import Divider from '@equinor/fusion-react-divider';

/**
 *
 * @returns Navigation with app list component
 */
export const QueryPage = (): JSX.Element => {
  const navStyles = useNavStyles();
  const styles = useStyles();
  return (
    <div className={navStyles.flex}>
      <div className={styles.container}>
        <h2 className={styles.main_title}>React Query</h2>
        <p>
          React Query is often described as the missing data-fetching library for React, but in more technical terms, it
          makes <strong>fetching, caching, synchronizing and updating server state</strong> in your React applications a
          breeze.
        </p>
        <p>Get yourself familiarized with it:</p>
        <List className={styles.list}>
          <ListItem>
            <a
              href="https://react-query.tanstack.com/overview"
              className={styles.list_link}
              target="_blank"
              rel="noreferrer"
            >
              Overview
            </a>
          </ListItem>
          <ListItem>
            <a
              href="https://react-query.tanstack.com/installation"
              className={styles.list_link}
              target="_blank"
              rel="noreferrer"
            >
              Installation
            </a>
          </ListItem>
          <ListItem>
            <a
              href="https://react-query.tanstack.com/quick-start"
              className={styles.list_link}
              target="_blank"
              rel="noreferrer"
            >
              Quick Start
            </a>
          </ListItem>
        </List>
        <Divider />
        <AppList />
      </div>
    </div>
  );
};
