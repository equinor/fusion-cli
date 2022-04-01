import { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';

import { Breadcrumb, BreadcrumbItemProps } from '@equinor/fusion-react-breadcrumb';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import useNavStyles from '../components/Navigation.style';
import useStyles from '../App.style';

/**
 * 
 * @returns AG Grid Table page for displaying fusion apps
 */
export const TablePage = (): JSX.Element => {
  const navigate = useNavigate();
  const navStyles = useNavStyles();
  const styles = useStyles();

  const breadcrumbs = (): BreadcrumbItemProps[] => {
    return [
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
  };

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps[]>(breadcrumbs());

  //u
  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ]);

  const [columnDefs] = useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ])

  return (
    <div className={navStyles.flex}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ag-grid/Docs-27.1.0-20220316/styles/ag-grid.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ag-grid/Docs-27.1.0-20220316/styles/ag-theme-material.min.css" />
      <Navigation selected='table' />
      <div className={navStyles.flex && styles.container}>
        <Breadcrumb currentLevel={1} isFetching={false} breadcrumbs={breadcrumb} />
        <div className="ag-theme-material" style={{ height: 400, width: 600 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}>
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default TablePage;