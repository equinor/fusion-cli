import { createStyles, makeStyles } from '@equinor/fusion-react-styles';

export const useAppStyle = makeStyles(
  (theme) =>
    createStyles({
      hello: {
        margin: theme.spacing.comfortable.medium.getVariable('padding'),
      },
      popover: {
        whiteSpace: 'nowrap',
      },
      container: {
        marginLeft: theme.spacing.comfortable.medium.getVariable('padding'),
        marginRight: theme.spacing.comfortable.medium.getVariable('padding'),
      },
    }),
  { name: 'app-style' }
);

export default useAppStyle;
