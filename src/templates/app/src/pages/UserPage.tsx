import { useEffect, useState } from 'react';
import { useCurrentUser, useNotificationCenter } from '@equinor/fusion';
import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';
import { useNavigate } from 'react-router-dom';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';
import { Divider } from '@equinor/fusion-react-divider';
import { AvatarSize, PersonCard } from '@equinor/fusion-react-person';

/**
 * User page
 *
 * @returns Users personal details
 */

export const UserPage = (): JSX.Element => {
  /**
   * User
   *
   * @see (@link https://github.com/equinor/fusion)
   * @constant currentUser calls useCurrentUser
   * @constant sendNotification calls useNotificationCenter
   */
  const currentUser = useCurrentUser();
  const sendNotification = useNotificationCenter();

  /**
   * Navigation
   *
   * @constant navigate calls useNavigate from react router
   * @see (@link https://github.com/equinor/fusion)
   */
  const navigate = useNavigate();

  /**
   * Styling
   *
   * @constant navStyles calls navigation style from components folder
   * @constant styles calls main app styles
   */
  const navStyles = useNavStyles();
  const styles = useStyles();

  /**
   * Breadcrumbs
   *
   * @returns current bredcrumbs location with additional properties
   */
  const breadcrumbs = (): BreadcrumbItemProps[] => {
    return [
      {
        onClick: () => {
          navigate('/');
        },
        name: 'Home',
      },
      {
        name: 'User',
      },
    ];
  };

  /**
   * Example of sending notificitation using async method
   */
  const sendWelcomeNotification = async () => {
    await sendNotification({
      id: 'This is a unique id which means the notification will only be shown once',
      level: 'medium',
      title: 'Welcome to your new fusion app! Open up src/index.tsx to start building your app!',
    });
  };

  useEffect(() => {
    sendWelcomeNotification();
  }, []);

  /**
   * Checks if the user is existing
   */
  if (!currentUser) {
    return (
      <>
        <h1>No user!</h1>
      </>
    );
  }

  const [breadcrumb] = useState<BreadcrumbItemProps[]>(breadcrumbs());

  return (
    <div className={navStyles.flex}>
      <div className={styles.container}>
        <div className={navStyles.breadcrumbs}>
          <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumb} />
        </div>
        <h2 className={styles.main_title}>Person Cards</h2>
        <div className={styles.user}>
          <PersonCard size={AvatarSize.Small} azureId="d8d9fa2f-ecee-4cfb-a371-a39e8c1b76aa" />
        </div>
        <div className={styles.user}>
          <PersonCard size={AvatarSize.Small} azureId="1ea5f203-c1ad-4893-bdea-4fadd95455e4" />
        </div>
        <Divider />
        <p>Here are some information that might be usefull to you:</p>
        <div>
          <h4>User Information Object</h4>
          <code>
            <pre>{JSON.stringify(currentUser.toObject(), null, 4)}</pre>
          </code>
        </div>
        <div>
          <h4>User Account Object</h4>
          <code>
            <pre>{JSON.stringify(currentUser, null, 4)}</pre>
          </code>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
