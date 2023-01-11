import { RefObject, useEffect, useRef, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { NavigationDrawer, NavigationStructure } from '@equinor/fusion-components';

import { pages, useCurrentPage } from '../Router';

/**
 * Creating the navigation
 * @see (@link https://equinor.github.io/fusion-components/?path=/story/general-navigation-drawer--default)
 * @see (@link https://github.com/equinor/fusion-components/tree/master/src/components/general/NavigationDrawer)
 *
 * @returns The structure of the navigation
 *
 */

const useAppPages = (navRef: RefObject<NavigateFunction>): NavigationStructure[] => {
  
  return pages.map(
    (page): NavigationStructure => ({
      id: page.name,
      title: page.title || page.name,
      type: 'grouping',
      icon: page.icon,
      onClick: () => {
        navRef.current?.(page.path ?? '');
      },
    })
  );
};

/**
 *
 * @returns Navigation drawer component
 */
export const Navigation = (): JSX.Element => {
  const navigate = useNavigate();
  const navRef = useRef(navigate);
  useEffect(() => {
    navRef.current = navigate;
  }, [navigate])
  const appPages = useAppPages(navRef);
  const [structure, setStructure] = useState<NavigationStructure[]>(appPages);
  const { name: currentPageName } = useCurrentPage() ?? {};
  return (
    <aside>
      <NavigationDrawer
        id="navigation-drawer-story"
        structure={structure}
        selectedId={currentPageName}
        onChangeStructure={(newStructure) => {
          setStructure(newStructure);
        }}
      />
    </aside>
  );
};

export default Navigation;
