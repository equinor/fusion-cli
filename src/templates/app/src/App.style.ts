import { createStyles, makeStyles } from '@equinor/fusion-react-styles';

/**
 * Custom app styling
 * 
 * @see (@link https://equinor.github.io/fusion-react-components/?path=/docs/styling--page)
 */
export const useAppStyle = makeStyles(
  /**
   * 
   * @param theme fusion parameter for default theme styling values
   * @returns additional style classes
   */
  (theme) =>
    createStyles({
      container: {
        width: '100%',
        height: '100%',
        paddingLeft: theme.spacing.comfortable.large.getVariable('padding'),
        paddingRight: theme.spacing.comfortable.large.getVariable('padding'),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
      },
      button_container: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
      },
      list: {
        maxWidth: 260,
      },
      list_link: {
        display: 'flex',
        alignItems: 'center',
        height: 48,
      },
      main_title: {
        marginTop: '30px !important',
      },
      user: {
        paddingBottom: 16,
        paddingTop: 32,
        maxWidth: 420,
      },
      mt_20: {
        marginTop: 20,
      },
      mb_20: {
        marginBottom: 20,
      },
      ml_20: {
        marginLeft: 20,
      },
    }),
  { name: 'app-style' }
);

export default useAppStyle;
