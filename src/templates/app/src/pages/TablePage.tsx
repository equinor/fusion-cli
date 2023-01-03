import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { updateApps, useAllApps } from '../api';
import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';
import { useNavigate } from 'react-router-dom';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { QueryKeys } from '../api/constants';

/**
 * additional fuction for formating date
 */
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatDate = (getDate: string) => {
  const date = new Date(getDate);
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}.`;
};

/**
 * Function that maps the values from all apps
 * @returns array of objects with index value and specified values form app object
 */
const useRowData = () => {
  const { data, isLoading } = useAllApps();
  const queryClient = useQueryClient();
  /**
   * useMutation example (runs after 10s on all published dates)
   */
  const updateAllApps = useMutation(updateApps, {
    onSuccess: (results) => {
      queryClient.setQueryData(QueryKeys.GetAllApps, results);
      console.log('update!');
    },
  });

  useEffect(() => {
    const fn = setTimeout(() => {
      updateAllApps.mutate(data!);
    }, 10000);
    return () => {
      clearTimeout(fn);
    };
  });

  const rowData = useMemo(() => {
    return Object.values(data ?? {}).map((app, index) => ({
      no: index + 1,
      name: app.name,
      category: app.category?.name,
      published: formatDate(app.publishedDate),
      version: app.version,
    }));
  }, [data]);
  return { rowData, isLoading };
};

/**
 *
 * @returns AG Grid Table page for displaying fusion apps
 */
export const TablePage = (): JSX.Element => {
  const navigate = useNavigate();
  const navStyles = useNavStyles();
  const styles = useStyles();

  const { rowData, isLoading } = useRowData();

  const breadcrumbs: BreadcrumbItemProps[] = [
    {
      onClick: () => {
        navigate('/');
      },
      name: 'Home',
    },
    {
      name: 'Table',
    },
  ];

  const [breadcrumb] = useState<BreadcrumbItemProps[]>(breadcrumbs);

  const [columnDefs] = useState([
    { field: 'no', width: 70, headerName: 'No.' },
    { field: 'name', resizable: true },
    { field: 'category', headerName: 'Category name', resizable: true },
    { field: 'published', headerName: 'Last published' },
    { field: 'version' },
  ]);

  /**
   * if the apps are loading
   */
  if (isLoading) {
    return (
      <div className={navStyles.flex}>
        <div className={styles.container}>
          <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumb} />
          <h4 className={styles.main_title}>Loading table...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className={navStyles.flex}>
      <link rel="stylesheet" href="https://unpkg.com/@ag-grid-community/core@27.1.0/dist/styles/ag-grid.css" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/@ag-grid-community/core@27.1.0/dist/styles/ag-theme-material.css"
      />
      <div className={styles.container} style={{ height: 'auto' }}>
        <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumb} />
        <h4 className={styles.main_title}>AG Grid Table Example</h4>
        <div className="ag-theme-material" style={{ height: '100%', width: 900 }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
