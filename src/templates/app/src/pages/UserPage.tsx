import { useEffect, useState } from 'react';
import { useCurrentUser, useNotificationCenter } from '@equinor/fusion';
import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';
import { PersonDetails } from '@equinor/fusion';
import { PersonDetail } from '@equinor/fusion-components';
import { Divider } from '@equinor/fusion-react-divider';

export const UserPage = (): JSX.Element => {
  const currentUser = useCurrentUser();
  const sendNotification = useNotificationCenter();
  const navStyles = useNavStyles();
  const styles = useStyles();
  const navigate = useNavigate();

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

  if (!currentUser) {
    return (
      <>
        <h1>No user!</h1>
      </>
    );
  };

  const personDetails = (): PersonDetails => ({
    azureUniqueId: currentUser.id,
    name: currentUser.fullName,
    mail: currentUser.upn,
    jobTitle: 'Developer',
    department: 'Fusion',
    mobilePhone: '+47987654321',
    officeLocation: 'Forusbeen 50',
    upn: currentUser.upn,
    accountType: 'Consultant',
    company: { id: '923 609 016', name: 'Equinor ASA' },
  });

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps[]>(breadcrumbs());
  const [person, setPerson] = useState<PersonDetails>(personDetails());

  return (
    <div className={navStyles.flex}>
      <Navigation />
      <div className={navStyles.flex && styles.container}>
        <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumb} />
        <div className={styles.user}>
          <PersonDetail
            person={person}
          />
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
