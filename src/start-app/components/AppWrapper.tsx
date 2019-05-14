import React, { useEffect, useState } from 'react';

import { registerAppListener } from '../scripts/register';
import { IManifest } from '../typings';

const AppWrapper: React.FC = () => {
  const [appKey] = useState('hello-world');
  const [manifest, setManifest] = useState({});

  useEffect(() => {
      const unregisterAppListener = registerAppListener((registeredAppKey, appManifest) => {
          updateManifest(registeredAppKey, {
              ...appManifest,
              failedToLoadAppBundle: false,
              isLoading: false,
          });
      });

      return () => {
          unregisterAppListener();
      };
  }, [appKey]);

  const updateManifest = (key: string, appManifest: IManifest) => {
      const existingManifest = getManifest(key);

      setManifest(prevManifest => ({
          ...prevManifest,
          [key]: {
              ...(existingManifest || {}),
              ...appManifest,
          },
      }));
  };

  const getManifest = (key: string) => {
      return (manifest as any)[key];
  };

  const getCurrentManifest = () => {
      return getManifest(appKey);
  };

  const getCurrentAppComponent = () => {
      const currentManifest = getCurrentManifest();

      if (!currentManifest) {
          return null;
      }

      return currentManifest.AppComponent;
  };

  const AppComponent: React.ComponentType | null = getCurrentAppComponent();
  if (!AppComponent) {
      return null;
  }

  return <AppComponent />;
};

export default AppWrapper;
