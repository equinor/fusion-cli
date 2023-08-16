import { registerApp } from '@equinor/fusion';
import { ErrorBoundary, PowerBIReport } from '@equinor/fusion-components';

export const AppComponent = (): JSX.Element => {
  const globalId = '{GLOBALID}';

  return (
    <ErrorBoundary>
      <PowerBIReport reportId={globalId} />
    </ErrorBoundary>
  );
};
registerApp('{appKey}', {
  AppComponent,
});

if (module.hot) {
  module.hot.accept();
}
