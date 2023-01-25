import React, { useCallback } from 'react';
import {
  ContextProvider,
  ContextSearch,
  ContextSearchProps,
  ContextSelectEvent,
} from '@equinor/fusion-react-context-selector';
import { useContextResolver } from './useContextResolver';

/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSearchProps): JSX.Element | null => {
  const { resolver, provider } = useContextResolver();

  const updateContext = useCallback(
    (e: ContextSelectEvent) => {
      if (provider) {
        if (e.type === 'select') {
          if (e.nativeEvent.detail.selected.length) {
            provider.contextClient.setCurrentContext(e.nativeEvent.detail.selected[0].id);
          }
        } else {
          provider.clearCurrentContext();
        }
      }
    },
    [provider]
  );

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
            onClearContext={(e) => updateContext(e as unknown as ContextSelectEvent)}
          />
        </ContextProvider>
      </div>
    )
  );
};

export default ContextSelector;
