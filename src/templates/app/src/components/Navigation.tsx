import { Link, useNavigate } from 'react-router-dom';
import { NavigationDrawer, NavigationStructure } from '@equinor/fusion-components';
import { Chip } from '@equinor/fusion-react-chip';
import { Icon } from '@equinor/fusion-react-icon';
import { Avatar } from '@equinor/fusion-react-avatar';
import { useState } from 'react';
import { useMemo } from 'react';

const useNavigationStructure = (): NavigationStructure[] => {
  const groupingRef = { id: 'navigationItemGrouping' };
  const childRef = { id: 'navigationItemChild' };
  const labelRef = { id: 'navigationItemSection' };
  const sectionRef = { id: 'navigationItemLabel' };
  const navigate = useNavigate();

  return useMemo(() => [
    {
      id: 'labe1',
      title: 'Main Menu',
      type: 'label',
      info: labelRef
    },
    {
      id: 'home',
      type: 'grouping',
      title: 'Home',
      icon: <Icon icon="home" />,
      onClick: () => {
        navigate("/");
      }
    },
    {
      id: 'apps',
      type: 'grouping',
      title: 'Apps (React Query working example)',
      icon: <Icon icon="apps" />,
      onClick: () => {
        navigate("/apps");
      }
    },
    {
      id: 'user',
      type: 'grouping',
      title: 'User',
      icon: <Icon icon="account_circle" />,
      onClick: () => {
        navigate("/user");
      }
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
              aside: <Chip variant="filled" icon="settings">Hei</Chip>,
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
      id: 'grouping2',
      type: 'grouping',
      title: 'Group with Avatar',
      icon: <Avatar src="https://i.imgur.com/GcZeeXX.jpeg" />,
      navigationChildren: [
        {
          id: 'section2',
          title: 'Section Disabled',
          type: 'section',
          isDisabled: true,
          navigationChildren: [
            {
              id: 'child4',
              type: 'child',
              title: 'Child Disabled',
              isDisabled: true,
            },
            {
              id: 'child5',
              type: 'child',
              title: 'Child5',
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
              aside: <Chip variant="filled" icon="android">App</Chip>,
            },
          ],
        },
      ],
    },
    {
      id: 'grouping4',
      type: 'grouping',
      title: 'Icons front and back',
      icon: <Icon icon="warning_outlined" />,
      aside: <Icon icon="warning_outlined" />,
    }
  ], [navigate]
  )
}

export const Navigation = (): JSX.Element => {
  const [structure, setStructure] = useState<NavigationStructure[]>(useNavigationStructure());
  const [selected, setSelected] = useState<string>('home');

  return (
    <aside>
      <NavigationDrawer
        id="navigation-drawer-story"
        structure={structure}
        selectedId={selected}
        onChangeSelectedId={(selectedItem) => setSelected(selectedItem)}
        onChangeStructure={(newStructure) => {
          setStructure(newStructure);
        }}
      />
    </aside>
  );
}

