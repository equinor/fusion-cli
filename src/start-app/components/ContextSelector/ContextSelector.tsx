import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ContextProvider,
  ContextSearch,
  ContextSearchProps,
  ContextSelectEvent,
} from '@equinor/fusion-react-context-selector';
import { useFramework } from '@equinor/fusion-framework-react';
import { useContextResolver } from './useContextResolver';
import type { NavigationModule } from '@equinor/fusion-framework-module-navigation';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import { useObservableState } from '@equinor/fusion-observable/react';
import { EMPTY, pairwise } from 'rxjs';

/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSearchProps): JSX.Element | null => {
  const { resolver, provider, currentContext: [selectedContextItem] } = useContextResolver();
  
  const framework = useFramework<[AppModule, NavigationModule]>();
  const {value: currentApp } = useObservableState(useMemo(() => framework.modules.app.current$, [framework]));
  const {value: appManifest} = useObservableState(useMemo(() => currentApp?.getManifest() ?? EMPTY, [currentApp]));
  const {value: ctx} = useObservableState(useMemo(() => framework.modules.context.currentContext$.pipe(pairwise()), []));

  const updateContext = useCallback(
    (e) => {
      if (provider) {
        if (e.type === 'select') {
          const ev = e as unknown as ContextSelectEvent;
          if (ev.nativeEvent.detail.selected.length) {
            provider.contextClient.setCurrentContext(ev.nativeEvent.detail.selected[0].id);
          }
        } else {
          provider.clearCurrentContext();
        }
      }
    },
    [provider]
  );

  const {navigator} = framework.modules.navigation;
  
  /**
   * Get contextid from url
   * @return string ContextId if numerical or guid.
   */
  const urlContext = (appKey: string): string => {
    const parts = navigator.location.pathname.split('/').filter((p) => p && ['apps', appKey].indexOf(p) < 0);
    if (parts?.length && parts[0].length) {
      const ctx = parts[0];
      if (ctx.match(/^\d+$/) || ctx.match(/^(?:[a-z0-9]+-){4}[a-z0-9]+$/)) {
        return ctx;
      }
    }
    return '';
  };

  useEffect(() => {
    if (!provider) {
      // app provider required
      return;
    }
    
    if(!ctx) {
      if ( provider && appManifest ) {
        const urlCtx = urlContext(appManifest.key);
        if ( urlCtx ) {
          console.log('CONTEXTSELECTOR::Setting context from url:', urlCtx);
          provider.contextClient.setCurrentContext(urlCtx);
        }
      }
      return
    };

    const [ previousContext, nextContext ] = ctx;
    
    if(!nextContext && !previousContext ) {
      return;
    }
    
    const manifest = appManifest;
    let setUrl = '';
    if (manifest && nextContext) {
      // setting context
      const p = previousContext?.id ?? urlContext(manifest.key);
      setUrl = p ? navigator.location.pathname.replace(p,nextContext?.id) : `/${nextContext?.id}`;
    } else if (previousContext) {
      // clearing context
      setUrl = navigator.location.pathname.replace(previousContext.id, '');
      
      // clear local storage
      // @TODO - use localstorage provider
      const storage = window.localStorage.getItem('FUSION_CURRENT_CONTEXT');
      if (storage) {
        const storage_obj = JSON.parse(storage);
        if (storage_obj?.current) {
          console.log('CONTEXTSELECTOR::Clearing context localStorage');
          delete storage_obj.current;
          const setStorage = JSON.stringify(storage_obj);
          window.localStorage.setItem('FUSION_CURRENT_CONTEXT', setStorage);
        }
      }
    }
    
    if (!setUrl) {
      return;
    }
    
    console.log('CONTEXTSELECTOR::Setting url to: ', setUrl);
    
    const reqId = requestAnimationFrame(() => navigator.replace(setUrl));
    return () => cancelAnimationFrame(reqId);
  }, [ctx, navigator, provider]);

  return (
    resolver && (
      <div style={{ flex: 1, maxWidth: '480px' }}>
        <ContextProvider resolver={resolver}>
          <ContextSearch
            id="context-selector-cli-header"
            placeholder={props.placeholder ?? 'Search for context'}
            initialText={props.initialText ?? 'Start typing to search'}
            dropdownHeight={props.dropdownHeight ?? '300px'}
            variant={props.variant ?? 'header'}
            onSelect={updateContext}
            autofocus={true}
            previewItem={selectedContextItem}
            value={selectedContextItem?.title}
            selectedId={selectedContextItem?.title}
            onClearContext={updateContext}
          />
        </ContextProvider>
      </div>
    )
  );
};

export default ContextSelector;
