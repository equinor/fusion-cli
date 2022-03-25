import { useEffect } from 'react';
import { useCurrentUser, useNotificationCenter } from '@equinor/fusion';
import { Navigation } from '../components/Navigation';
import useNavStyles from "../components/Navigation.style";
import useStyles from '../App.style';


export const UserPage = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const account = useCurrentUser();

  const sendNotification = useNotificationCenter();
  const navStyles = useNavStyles();
  const styles = useStyles();




  const sendWelcomeNotification = async () => {
    await sendNotification({
      id: 'This is a unique id which means the notification will only be shown once',
      level: 'medium',
      title:
        'Welcome to your new fusion app! Open up src/index.tsx to start building your app!',
    });
  };

  useEffect(() => {
    sendWelcomeNotification();
  }, []);

  if (!currentUser) {
    return (
      <>
        <h1>No user!</h1>
      </>
    );
  }

  return (
    <div className={navStyles.flex}>
      <Navigation />
      <div className={navStyles.flex && styles.container}>
        <h1>Oh hello there, {currentUser.fullName}</h1>
        <p>Here are some information that might be usefull to you:</p>
        <div>
          <h3>About User</h3>
          <code>
            <pre>{JSON.stringify(account, null, 4)}</pre>
          </code>
        </div>
      </div>
    </div>
  );
};

export default UserPage;