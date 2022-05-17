import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const useAppPages = (): NavigationStructure[] => {
  const navigate = useNavigate();
  return pages.map(
    (page): NavigationStructure => ({
      id: page.name,
      title: page.title || page.name,
      type: 'grouping',
      icon: page.icon,
      onClick: () => {
        navigate(page.path ?? '');
      },
    })
  );
};

/**
 *
 * @returns Navigation drawer component
 */
export const Navigation = (): JSX.Element => {
  const appPages = useAppPages();
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
