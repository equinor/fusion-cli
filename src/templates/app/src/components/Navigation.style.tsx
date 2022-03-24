import { makeStyles, createStyles } from '@equinor/fusion-react-styles';

export const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: () => ({
      }),
      flex: {
        display: 'flex',
      }
    }),
  // name the stylesheet for easy debugging
  { name: 'navigation' }
);

export default useStyles;
