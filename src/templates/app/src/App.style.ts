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
      mainTitle: {
        marginTop: '30px !important',
      },
      container: {
        marginLeft: theme.spacing.comfortable.large.getVariable('padding'),
        marginRight: theme.spacing.comfortable.large.getVariable('padding'),
        paddingTop: theme.spacing.comfortable.medium.getVariable('padding'),
        paddingBottom: theme.spacing.comfortable.medium.getVariable('padding'),
        maxWidth: '1280px'
      },
      user: { 
        paddingBottom: '16px', 
        paddingTop: '32px',
        maxWidth: '420px', 
      }
    }),
  { name: 'app-style' }
);

export default useAppStyle;
