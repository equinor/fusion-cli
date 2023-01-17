import React, { useCallback } from 'react';
import {
  ContextProvider,
  ContextSelectorHeader,
  ContextSelectorProps,
  ContextSelectEvent,
} from '@equinor/fusion-react-context-selector';
import { useContextResolver } from './useContextResolver';

/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSelectorProps): JSX.Element | null => {
  const { resolver, provider } = useContextResolver();

  const updateContext = useCallback(
    (e: ContextSelectEvent) => {
      if (e.nativeEvent.detail.selected.length) {
        if (provider) {
          provider.contextClient.setCurrentContext(e.nativeEvent.detail.selected[0].id);
        }
      }
    },
    [provider]
  );

  return (
    resolver && (
      <ContextProvider resolver={resolver}>
        <div style={{ display: 'flex' }}>
          <ContextSelectorHeader
            id="context-selector-cli-header"
            placeholder={props.placeholder ?? 'Search for context'}
            initialText={props.initialText ?? 'Start typing to search'}
            dropdownHeight={props.dropdownHeight ?? '300px'}
            variant={props.variant ?? 'header'}
            onSelect={updateContext}
            autofocus={true}
            onClearContext={() => console.log('Clearing Context')}
          />
        </div>
      </ContextProvider>
    )
  );
};

export default ContextSelector;
