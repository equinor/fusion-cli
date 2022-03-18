import { clsx } from '@equinor/fusion-react-styles';
import { App } from '../types';

import { useStyles } from './AppInfo.style';

type AppInfoProps = {
  app: App;
};

export const AppInfo = ({ app }: AppInfoProps): JSX.Element => {
  const { name, category } = app;
  const styles = useStyles({ color: category?.color || 'black' });
  return (
    <div className={clsx(name.match(/mmp/i) && styles.red, styles.root)}>
      <div dangerouslySetInnerHTML={{ __html: category?.defaultIcon }} />
      <div className={styles.title}>{name}</div>
    </div>
  );
};

export default AppInfo;
