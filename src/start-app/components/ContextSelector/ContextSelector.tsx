import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  ContextProvider,
  ContextResultItem,
  ContextSearch,
  ContextSearchProps,
  ContextSelectEvent,
} from '@equinor/fusion-react-context-selector';
import { useContextResolver, mapper } from './useContextResolver';

type AppManifestWithContext = AppManifest & {context: ContextManifest | undefined}
/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSearchProps): JSX.Element | null => {
  const { resolver, provider, currentContext } = useContextResolver();

  const selectedContext = useMemo(() => {{
    if (currentContext) {
      return mapper([currentContext])[0];
    }
  }}, [currentContext]);
  
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
    const url = p ? navigator.location.pathname.replace(p, nextContext?.id) : `/apps/${nextContext?.id}`;
    
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
            autofocus={true}
            previewItem={selectedContext}
            value={selectedContext?.title}
            selectedId={selectedContext?.id}
            onSelect={updateContext}
            onClearContext={(e) => updateContext(e as unknown as ContextSelectEvent)}
          />
        </ContextProvider>
      </div>
    )
  );
};

export default ContextSelector;
