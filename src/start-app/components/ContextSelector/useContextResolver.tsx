import { useCallback, useMemo, useState } from 'react';
import { useFramework } from '@equinor/fusion-framework-react';
import { useCurrentApp } from '@equinor/fusion-framework-react/app';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import { ContextItem, ContextModule, IContextProvider } from '@equinor/fusion-framework-module-context';
import { useObservableState, useObservableSubscription } from '@equinor/fusion-observable/react';
import '@equinor/fusion-framework-app';

import { EMPTY } from 'rxjs';

import { ContextResult, ContextResultItem, ContextResolver } from '@equinor/fusion-react-context-selector';
import { AppModulesInstance } from '@equinor/fusion-framework-app';
import { NavigationModule } from '@equinor/fusion-framework-module-navigation';

/**
 * Map context query result to ContextSelectorResult.
 * Add any icons to selected types by using the 'graphic' property
 * @param src context query result
 * @returns src mapped to ContextResult type
 */
const mapper = (src: Array<ContextItem>): ContextResult => {
  return src.map((i) => {
    return {
      id: i.id,
      title: i.title,
      subTitle: i.type.id,
      graphic: i.type.id === 'OrgChart' ? 'list' : undefined,
    };
  });
};

/**
 * Create a single ContextResultItem
 * @param props pops for the item to merge with defaults
 * @returns ContextResultItem
 */
const singleItem = (props: Partial<ContextResultItem>): ContextResultItem => {
  return Object.assign({ id: 'no-such-item', title: 'Change me' }, props);
};

const noPreselect: ContextResult = [];

/**
 * Hook for querying context and setting resolver for ContextSelector component
 * See React Components storybook for info about ContextSelector component and its resolver
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @return Array<ContextResolver, SetContextCallback>
 */
export const useContextResolver = (): { resolver: ContextResolver | null; provider: IContextProvider | null } => {
  /* Framework modules */
  const framework = useFramework<[AppModule, NavigationModule]>();
  /* Current context observable */
  const {value: currentContext} = useObservableState(framework.modules.context.currentContext$);

  /* context provider state */
  const [provider, setProvider] = useState<IContextProvider | null>(null);

  const { currentApp } = useCurrentApp();

  /* Set currentContext as initialResult in dropdown  */
  const preselected: ContextResult = useMemo(() => {
    return currentContext ? mapper([currentContext]) : noPreselect;
  }, [currentContext]);

  /** App module collection instance */
  const instance$ = useMemo(() => currentApp?.instance$ || EMPTY, [currentApp]);

  /** callback function when current app instance changes */
  const onContextProviderChange = useCallback(
    (modules: AppModulesInstance) => {
      /** try to get the context module from the app module instance */
      const contextProvider = (modules as AppModulesInstance<[ContextModule]>).context;
      if (contextProvider) {
        setProvider(contextProvider);
      } else {
        setProvider(null);
      }
    },
    [setProvider]
  );

  /** clear the app provider */
  const clearContextProvider = useCallback(() => setProvider(null), [setProvider]);

  /** observe changes to app modules and  clear / set the context provider on change */
  useObservableSubscription(instance$, onContextProviderChange, clearContextProvider);

  /**
   * set resolver for ContextSelector
   * @return ContextResolver
   */
  const minLength = 2;
  const resolver = useMemo(
    (): ContextResolver | null =>
      provider && {
        searchQuery: async (search: string) => {
          if (search.length < minLength) {
            return [
              singleItem({
                id: 'min-length',
                title: `Type ${minLength - search.length} more chars to search`,
                isDisabled: true,
              }),
            ];
          }
          try {
            const result = await provider.queryContextAsync(search);
            if (result.length) {
              return mapper(result);
            }
            return [
              singleItem({
                id: 'no-results',
                title: 'No results found',
                isDisabled: true,
              }),
            ];
          } catch (e) {
            console.log('🥩 - ContextResolver query was cancelled');
            return [];
          }
        },
        initialResult: preselected,
      },
    [provider, preselected]
  );

  return { resolver, provider };
};

export default useContextResolver;
