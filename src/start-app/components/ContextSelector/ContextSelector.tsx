import React, { useCallback } from 'react';
import {
  ContextSelector as ContextSelectorComponent,
  ContextSelectorProps,
  ContextSelectEvent,
} from '@equinor/fusion-react-context-selector';
import { useFramework } from '@equinor/fusion-framework-react';

/**
 * See fusion-react-component storybook for available attributes
 * @link https://equinor.github.io/fusion-react-components/?path=/docs/data-contextselector--component
 * @returns JSX element
 */
export const ContextSelector = (props: ContextSelectorProps): JSX.Element => {
  const framework = useFramework();

  const updateContext = useCallback(
    (e: ContextSelectEvent) => {
      if (e.nativeEvent.detail.selected.length) {
        framework.modules.context.contextClient.setCurrentContext(e.nativeEvent.detail.selected[0].id);
      }
    },
    [framework]
  );

  return (
    <div style={{ display: 'flex', maxWidth: '480px' }}>
      <ContextSelectorComponent
        id="context-selector-cli-header"
        placeholder={props.placeholder ?? 'Search for context'}
        initialText={props.initialText ?? 'Start typing to search'}
        dropdownHeight={props.dropdownHeight ?? '300px'}
        variant={props.variant ?? 'header'}
        onSelect={updateContext}
      ></ContextSelectorComponent>
    </div>
  );
};

export default ContextSelector;
