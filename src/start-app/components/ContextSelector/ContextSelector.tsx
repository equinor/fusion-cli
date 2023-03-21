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
import type { AppModule, AppManifest } from '@equinor/fusion-framework-module-app';
import { useObservableState } from '@equinor/fusion-observable/react';
import { EMPTY, pairwise } from 'rxjs';
import { ContextManifest } from '@equinor/fusion';

type AppManifestWithContext = AppManifest & {context: ContextManifest | undefined}
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
    if(!ctx) return;
    const [ previousContext, nextContext ] = ctx;
    if(!nextContext) return; // TODO
    
    const manifest = appManifest as AppManifestWithContext;
    const p = previousContext?.id ?? urlContext(manifest.key);
    const url = p ? navigator.location.pathname.replace(p, nextContext?.id) : `/apps/${manifest.key}/${nextContext?.id}`;
    
    const reqId = requestAnimationFrame(() => navigator.replace(url));
    return () => cancelAnimationFrame(reqId);
  }, [ctx, navigator]);

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
