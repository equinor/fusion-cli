import { Button } from '@equinor/fusion-react-button';
import { Icon } from '@equinor/fusion-react-icon';
import { List, ListItem } from '@equinor/fusion-react-list';
import { Navigation } from '../components/Navigation';
import useNavStyles from "../components/Navigation.style";
import useStyles from '../App.style';
import { Tooltip } from '@equinor/fusion-react-tooltip';

export const HomePage = (): JSX.Element => {
  const navStyles = useNavStyles();
  const styles = useStyles();

  return (
    <div className={navStyles.flex}>
      <Navigation />
      <div className={navStyles.flex && styles.container}>
        <h1>Welcome to the Fusion CLI</h1>
        <p>Here you can see examples of some of the possibilities that you can use</p>
        <hr />
        <h2 className={styles.mainTitle}>React Query</h2>
        <p>React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes <strong>fetching, caching, synchronizing and updating server state</strong> in your React applications a breeze.</p>
        <p>Get yourself familiarized with it:</p>
        <List>
          <ListItem><a href="https://react-query.tanstack.com/overview" target="_blank" >Overview</a></ListItem>
          <ListItem><a href="https://react-query.tanstack.com/installation" target="_blank" >Installation</a></ListItem>
          <ListItem><a href="https://react-query.tanstack.com/quick-start" target="_blank" >Quick Start</a></ListItem>
        </List>
        <hr />
        <h2 className={styles.mainTitle}>Components</h2>
        <p>View few of the components and read more about them <a href="https://equinor.github.io/fusion-react-components/?path=%2Fdocs%2Fintro--page%2F" target="_blank" >here</a></p>
        <h4 style={{ marginBottom: 20 }}>Button - details <a href="https://equinor.github.io/fusion-react-components/?path=/docs/input-button--page" target="_blank" ><strong>@equinor/fusion-react-button</strong></a></h4>
        <div style={{ marginLeft: 20 }}>
          <p>With Icon</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Button variant="outlined">
              <span slot="icon"><Icon icon="settings" /></span>
              <span>
                <b>Custom</b> - <i>icon left</i>
              </span>
            </Button>
            <Button variant="outlined">
              <span>
                <b>Custom</b> - <i>icon right</i>
              </span>
              <span slot="trailingIcon"><Icon icon="wifi" /></span>
            </Button>
          </div>
          <p>Different colors</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Button color="primary" label="primary" />
            <Button color="secondary" label="secondary" />
            <Button color="danger" label="danger" />
          </div>
        </div>
        <h4 style={{ marginBottom: 20 }}>Button - details <a href="https://equinor.github.io/fusion-react-components/?path=/docs/input-button--page" target="_blank" ><strong>@equinor/fusion-react-button</strong></a></h4>
        <div style={{ marginLeft: 20 }}>
          <Tooltip content="Default Tooltip">
            <button>
              Hover Me!
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
