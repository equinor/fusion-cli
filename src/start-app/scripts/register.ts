import Guid from 'guid';

import { AppRegistrationListener, IManifest, IRegisteredApps } from '../typings';

const REGISTER_FUSION_APP = 'REGISTER_FUSION_APP';
const registeredApps: IRegisteredApps[] = [];
const listeners: AppRegistrationListener[] = [];

export const registerApp = (appKey: string, manifest: IManifest): void => {
  const manifestKey = Guid.raw();
  (window as any)[manifestKey] = manifest;
  window.postMessage(
    {
      appKey,
      manifestKey,
      type: REGISTER_FUSION_APP,
    },
    window.location.href
  );
};

export const registerAppListener = (listener: AppRegistrationListener)=> {
  listeners.push(listener);
  registeredApps.forEach(app => listener(app.appKey, app.manifest));
  return () => listeners.splice(listeners.indexOf(listener), 1);
};

const notifyListeners = (appKey: string, manifest: IManifest): void => {
  listeners.forEach(listener => listener(appKey, manifest));
};
 
window.addEventListener('message', e => { 
  if (e.data && e.data.type === REGISTER_FUSION_APP && e.origin === window.location.origin) {
    const { appKey, manifestKey } = e.data;
    const manifest = (window as any)[manifestKey];

    delete (window as any)[manifestKey];

    notifyListeners(appKey, manifest);

    registeredApps.push({
      appKey,
      manifest,
    });
  }
});
