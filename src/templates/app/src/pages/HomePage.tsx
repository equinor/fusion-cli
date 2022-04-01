import { Navigation } from '../components/Navigation';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';
import { Button } from '@equinor/fusion-react-button';
import { Icon } from '@equinor/fusion-react-icon';
import { List, ListItem } from '@equinor/fusion-react-list';
import { Tooltip } from '@equinor/fusion-react-tooltip';
import { Divider } from '@equinor/fusion-react-divider';

/**
 * Home Page
 * 
 * @returns Navigation with few component examples and documentation for React Query
 * React Query @see (@link https://react-query.tanstack.com)
 */
export const HomePage = (): JSX.Element => {
  const navStyles = useNavStyles();
  const styles = useStyles();

  /**
   * Usage of react components like List, Button, Devider, Tooltip
   * 
   * Storybook @see (@link https://equinor.github.io/fusion-react-components/?path=%2Fdocs%2Fintro--page%2F)
   * Git repository @see (@link https://github.com/equinor/fusion-react-components)
   */
  return (
    <div className={navStyles.flex}>
      <Navigation selected='home' />
      <div className={styles.container}>
        <h1>Welcome to the Fusion CLI</h1>
        <p>Here you can see examples of some of the possibilities that you can use</p>
        <Divider />
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
        <h2 className={styles.main_title}>Components</h2>
        <p>
          View few of the fusion components and read more about them
          <a
            href="https://equinor.github.io/fusion-react-components/?path=%2Fdocs%2Fintro--page%2F"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </p>
        <div>
          <h4>
            Button - details
            <a
              href="https://equinor.github.io/fusion-react-components/?path=/docs/input-button--page"
              target="_blank"
              rel="noreferrer"
            >
              <strong>@equinor/fusion-react-button</strong>
            </a>
          </h4>
          <div className={styles.ml_20}>
            <p>With Icon</p>
            <div className={`${styles.button_container}`}>
              <Button variant="outlined">
                <span slot="icon">
                  <Icon icon="settings" />
                </span>
                <span>
                  <b>Custom</b> - <i>icon left</i>
                </span>
              </Button>
              <Button variant="outlined">
                <span>
                  <b>Custom</b> - <i>icon right</i>
                </span>
                <span slot="trailingIcon">
                  <Icon icon="wifi" />
                </span>
              </Button>
            </div>
            <p>Different colors</p>
            <div className={`${styles.button_container} ${styles.mb_20}`}>
              <Button color="primary" label="primary" />
              <Button color="secondary" label="secondary" />
              <Button color="danger" label="danger" />
            </div>
          </div>
        </div>
        <div>
          <h4>
            Tooltip - details
            <a href="https://equinor.github.io/fusion-react-components/?path=/docs/input-tooltip--page">
              <strong>@equinor/fusion-react-tooltip</strong>
            </a>
          </h4>
          <div className={styles.ml_20}>
            <p>React component for displaying tooltip</p>
            <Tooltip content="Default Tooltip">
              <button>Hover Me!</button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
