import { Button } from '@equinor/fusion-react-button';
import { List, ListItem } from '@equinor/fusion-react-list';
import { Navigation } from '../components/Navigation';
import useNavStyles from "../components/Navigation.style";
import useStyles from '../App.style';

export const HomePage = (): JSX.Element => {
  const navStyles = useNavStyles();
  const styles = useStyles();
  return (
    <div className={navStyles.flex}>
      <Navigation />
      <div className={navStyles.flex && styles.container}>
        <h1>Welcome to the Fusion CLI</h1>
        <h3>Here you can see examples of some of the possibilities that you can use</h3>
        <Button variant="outlined">
          <span slot="icon">🚨</span>
          <span>
            <b>Custom</b> - <i>label</i>
          </span>
          <span slot="trailingIcon">🚀</span>
        </Button>
        <div style={{ display: 'inline-flex', gap: 10 }}>
          <Button color="primary" label="primary" />
          <Button color="secondary" label="secondary" />
          <Button color="danger" label="danger" />
        </div>
        <List>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 3</ListItem>
        </List>
      </div>
    </div>
  );
};
