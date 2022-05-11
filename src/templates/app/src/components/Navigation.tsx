import { useNavigate } from 'react-router-dom';
import { NavigationDrawer, NavigationStructure } from '@equinor/fusion-components';
import { Chip } from '@equinor/fusion-react-chip';
import { Icon } from '@equinor/fusion-react-icon';
import { Avatar } from '@equinor/fusion-react-avatar';
import { useState } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
/**
 * Creating the navigation
 * @see (@link https://equinor.github.io/fusion-components/?path=/story/general-navigation-drawer--default)
 * @see (@link https://github.com/equinor/fusion-components/tree/master/src/components/general/NavigationDrawer)
 *
 * @returns The structure of the navigation
 *
 */

const useNavigationStructure = (): NavigationStructure[] => {
  /**
   * Navigation references
   */
  const groupingRef = { id: 'navigationItemGrouping' };
  const childRef = { id: 'navigationItemChild' };
  const labelRef = { id: 'navigationItemSection' };
  const sectionRef = { id: 'navigationItemLabel' };

  /**
   * Added useNavigate function from react-router-dom so that we could use it for navigating on click
   * @see (@link https://reactrouterdotcom.fly.dev/docs/en/v6/getting-started/concepts#navigate-function)
   */
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        id: 'labe1',
        title: 'Main Menu',
        type: 'label',
        info: labelRef,
      },
      {
        id: 'home',
        type: 'grouping',
        title: 'Home',
        icon: <Icon icon="home" />,
        onClick: () => {
          navigate('/');
        },
      },
      {
        id: 'apps',
        type: 'grouping',
        title: 'Apps (React Query working example)',
        icon: <Icon icon="apps" />,
        onClick: () => {
          navigate('/apps');
        },
      },
      {
        id: 'table',
        type: 'grouping',
        title: 'Table (AG Grid)',
        icon: <Icon icon="table_chart" />,
        onClick: () => {
          navigate('/table');
        },
      },
      {
        id: 'user',
        type: 'grouping',
        title: 'User',
        icon: <Icon icon="account_circle" />,
        onClick: () => {
          navigate('/user');
        },
      },
      {
        id: 'labe2',
        title: 'Grouping Examples',
        type: 'label',
        info: labelRef,
      },
      {
        id: 'grouping1',
        type: 'grouping',
        title: 'Group with Icon',
        icon: <Icon icon="check_circle_outlined" />,
        info: groupingRef,
        navigationChildren: [
          {
            id: 'section1',
            title: 'Section with children',
            type: 'section',
            navigationChildren: [
              {
                id: 'child',
                type: 'child',
                title: 'Child1',
              },
              {
                id: 'child1',
                type: 'child',
                title: 'Child with Chip',
                aside: (
                  <Chip variant="filled" icon="settings">
                    Hei
                  </Chip>
                ),
              },
            ],
          },
          {
            id: 'section80',
            title: 'New Section with children',
            type: 'section',
            navigationChildren: [
              {
                id: 'child51',
                type: 'child',
                title: 'First Child',
              },
              {
                id: 'child152',
                type: 'child',
                title: 'Second Child',
              },
            ],
          },
        ],
      },
      {
        id: 'grouping3',
        type: 'grouping',
        title: 'Grouping with Number as Icon',
        icon: '3',
        navigationChildren: [
          {
            id: 'section3',
            title: 'Section 3',
            type: 'section',
            info: sectionRef,
            navigationChildren: [
              {
                id: 's3c1',
                type: 'child',
                info: childRef,
                title: 'Child4',
                aside: (
                  <Chip variant="filled" icon="android">
                    App
                  </Chip>
                ),
              },
            ],
          },
        ],
      },
    ],
    [navigate]
  );
};

/**
 * property type for selected menu element
 */
type Props = {
  selected: string
};

/**
 *
 * @returns Navigation drawer component
 */
export const Navigation = ({ selected }: Props): JSX.Element => {
  const [structure, setStructure] = useState<NavigationStructure[]>(useNavigationStructure());
  //const [selected, setSelected] = useState<string>("home");

  return (
    <aside>
      <NavigationDrawer
        id="navigation-drawer-story"
        structure={structure}
        selectedId={selected}
        //onChangeSelectedId={(selectedItem) => setSelected(selectedItem)}
        onChangeStructure={(newStructure) => {
          setStructure(newStructure);
        }}
      />
    </aside>
  );
};
