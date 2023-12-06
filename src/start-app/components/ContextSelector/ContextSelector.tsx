import React, { FunctionComponent, useCallback } from 'react';
import {
  ContextProvider,
  ContextSearch,
  ContextSearchProps,
  ContextSelectEvent
} from '@equinor/fusion-react-context-selector';
import { useContextResolver } from './useContextResolver';
import { AppManifest } from '@equinor/fusion';
import { HeaderContentProps } from '@equinor/fusion-components';

/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSearchProps & Partial<HeaderContentProps>): React.JSX.Element | null => {
  const {
    resolver,
    provider,
    currentContext: [selectedContextItem]
  } = useContextResolver();

  /** callback handler for context selector, when context is changed or cleared */
  const onContextSelect = useCallback(
    (event: any) => {
      if (provider) {
        if (event.type === 'select') {
          const ev = event as ContextSelectEvent;
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

  if (!resolver) return null;

  return (
    <div style={{ flex: 1, maxWidth: '480px' }}>
      <ContextProvider resolver={resolver}>
        <ContextSearch
          id="context-selector-cli-header"
          placeholder={'Search for context'}
          initialText={'Start typing to search'}
          dropdownHeight={'300px'}
          variant={'header'}
          onSelect={onContextSelect}
          autofocus={true}
          previewItem={selectedContextItem}
          value={selectedContextItem?.title}
          selectedId={selectedContextItem?.title}
          onClearContext={onContextSelect}
        />
      </ContextProvider>
    </div>
  );
};

export default ContextSelector;
