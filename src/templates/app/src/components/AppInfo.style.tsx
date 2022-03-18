import { makeStyles, createStyles } from '@equinor/fusion-react-styles';

type AppInfoStyleProps = {
  color: string;
};

export const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: ({ color }: AppInfoStyleProps) => ({
        color,
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.comfortable.large.getVariable('padding'),
      }),
      red: {
        color: 'red !important',
      },
      title: {
        ...theme.typography.heading.h4.style,
      },
    }),
  // name the stylesheet for easy debugging
  { name: 'app-info' }
);

export default useStyles;
