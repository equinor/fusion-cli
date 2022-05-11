import { makeStyles, createStyles } from '@equinor/fusion-react-styles';

export const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: () => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
      }),
      title: {
        flex: '1 1 100%',
        textAlign: 'center',
        padding: theme.spacing.comfortable.large.getVariable('padding'),
      },
    }),
  // name the stylesheet for easy debugging
  { name: 'app-list' }
);

export default useStyles;
