import { makeStyles, createStyles } from '@equinor/fusion-react-styles';

export const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: () => ({}),
      flex: {
        display: 'flex',
        height: '100%',
      },
      breadcrumbs: {
        position: 'fixed',
        width: '100%',
        backgroundColor: '#fff',
        paddingBottom: theme.spacing.comfortable.medium.getVariable('padding'),
      },
    }),
  // name the stylesheet for easy debugging
  { name: 'navigation' }
);

export default useStyles;
