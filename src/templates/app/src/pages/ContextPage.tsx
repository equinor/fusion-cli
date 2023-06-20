import { useCurrentContext } from '@equinor/fusion';
import Divider from '@equinor/fusion-react-divider';
import { useOrgProject } from '../api/project';
import useStyles from '../App.style';

export const ContextPage = (): JSX.Element => {
  const styles = useStyles();
  const context = useCurrentContext();
  const { data, isLoading, error } = useOrgProject(context?.externalId ?? undefined);
  if (isLoading) {
    return <p>loading project for org chart [{context?.externalId}]</p>;
  }
  if (error) {
    return <p>An error occurred</p>;
  }
  return (
    <div className={styles.container}>
      <h3>current context</h3>
      <pre>{JSON.stringify(context, null, 4)}</pre>;
      <Divider />
      <h3>current project</h3>
      <pre>{JSON.stringify(data, null, 4)}</pre>;
    </div>
  );
};

export default ContextPage;
