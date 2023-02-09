import { PersonProvider } from '@equinor/fusion-react-person';
import { PropsWithChildren } from 'react';
import { usePersonResolver } from './usePersonResolver';

export const PersonResolver = (props: PropsWithChildren<Record<never, never>>): JSX.Element => {
  const personResolver = usePersonResolver();
  return <PersonProvider resolve={personResolver}>{props.children}</PersonProvider>;
};
