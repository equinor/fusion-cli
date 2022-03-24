import { makeStyles, createStyles } from '@equinor/fusion-react-styles';

type AppInfoStyleProps = {
  color: string;
};

export const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: ({ color }: AppInfoStyleProps) => ({
        color,
        flexBasis: '25%',
      }),
      app: ({ color }: AppInfoStyleProps) => ({
        display: 'flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: color,
        padding: theme.spacing.comfortable.medium_small.getVariable('padding'),
        margin: '5px',
        cursor: 'pointer',
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: theme.colors.interactive.primary__hover_alt.getVariable('color'),
          color: theme.colors.interactive.primary__hover.getVariable('color'),
          borderColor: theme.colors.interactive.primary__hover.getVariable('color'),
        }
      }),
      title: {
        ...theme.typography.table.cell_text,
        paddingLeft: theme.spacing.comfortable.small.getVariable('padding'),
      },
    }),
  // name the stylesheet for easy debugging
  { name: 'app-content' }
);

export default useStyles;
