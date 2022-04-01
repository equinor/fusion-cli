import { UseQueryResult } from 'react-query';
import { App } from '../types';
/**
 * get all registered app from the portal
 */
export declare const useAllApps: () => UseQueryResult<Record<string, App>>;
export default useAllApps;
