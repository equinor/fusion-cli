import { Button } from '@equinor/fusion-react-button';
import { List, ListItem } from '@equinor/fusion-react-list';
import { Navigation } from '../components/Navigation';

export const HomePage = (): JSX.Element => {
  return (
    <>
      <Navigation />
      <div>
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
    </>
  );
};
