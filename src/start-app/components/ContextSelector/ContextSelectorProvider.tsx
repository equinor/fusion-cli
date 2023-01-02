import React from 'react';
import { ContextProvider as ContextProviderComponent } from '@equinor/fusion-react-context-selector';

import { useContextResolver } from './useContextResolver';

export const ContextSelectorProvider = (props: JSX.ElementChildrenAttribute): JSX.Element => {
  const resolver = useContextResolver();
  return <ContextProviderComponent resolver={resolver}>{props.children}</ContextProviderComponent>;
};

export default ContextSelectorProvider;
