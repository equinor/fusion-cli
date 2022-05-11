import { UseQueryResult } from 'react-query';
import { App } from '../types';
/**
 * get all registered app from the portal
 */
export declare const useAllApps: () => UseQueryResult<Record<string, App>>;
/**
 * example fuction for updating publish date to todays date
 */
export declare const updateApps: (apps: Record<string, App>) => Promise<Record<string, App>>;
export default useAllApps;
