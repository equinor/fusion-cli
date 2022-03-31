import { clsx } from '@equinor/fusion-react-styles';
import { App } from '../types';

import { useStyles } from './AppInfo.style';

type AppInfoProps = {
  app: App;
};

/**
 *  
 * @returns App info element with with default and additional styling, default icon and default title
 */
export const AppInfo = ({ app }: AppInfoProps): JSX.Element => {
  const { name, category } = app;
  /**
   * 
   * @constant styles use styles with category color or if color doesn't exists, use black color
   */
  const styles = useStyles({ color: category?.color || 'black' });
  return (
    <div className={clsx(styles.root)}>
      <div className={styles.app}>
        <div dangerouslySetInnerHTML={{ __html: category?.defaultIcon }} />
        <div className={styles.title}>{name}</div>
      </div>
    </div>
  );
};

export default AppInfo;
