import { History } from 'history';

import {
  AppManifest,
  Context,
  EventHub,
  FeatureLogger,
  ReliableDictionary,
  LocalStorageProvider,
} from '@equinor/fusion';

import { configureModules } from '@equinor/fusion-framework-app';
import { AppModule } from '@equinor/fusion-framework-module-app';
import { enableContext } from '@equinor/fusion-framework-module-context';
import { ContextItem } from '@equinor/fusion-framework-module-context';

import { Fusion } from '@equinor/fusion-framework-react';
import { filter, scan, tap } from 'rxjs';
import { NavigationModule } from '@equinor/fusion-framework-module-navigation';

type ContextCache = {
  current: Context | null;
  history: Context[] | null;
  links: { [key: string]: string };
};

export default class CliContextManager extends ReliableDictionary<ContextCache> {
  #framework: Fusion<[AppModule, NavigationModule]>;

  constructor(args: {
    framework: Fusion<[AppModule, NavigationModule]>;
    // TODO - enable module-navigation
    history: History;
    featureLogger: FeatureLogger;
  }) {
    super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`, new EventHub()));

    this.#framework = args.framework;

    args.framework.modules.context.currentContext$
      .pipe(
        tap((x) => args.featureLogger.setCurrentContext(x?.id ?? null, x?.title ?? null)),
        filter((x): x is ContextItem => !!x),
        scan((acc, value) => {
          if (!acc.find((x) => x.id === value.id)) {
            return [value, ...acc].slice(0, 9);
          }
          return acc;
        }, [] as Array<ContextItem>)
      )
      .subscribe((values) => {
        const currentContext = values.shift();

        this.setAsync('history', values);

        if (currentContext) {
          this.setAsync('current', currentContext);
          args.featureLogger.log('Context selected', '0.0.1', {
            selectedContext: currentContext,
            // why do we need and array of all contexts?
            previusContexts: values.map((c) => ({ id: c.id, name: c.title })),
          });
          this.#framework.modules.navigation.navigator.push(['', currentContext.id].join('/'));
        }
      });

    args.framework.modules.app.current$.subscribe((app) => {
      if (app) {
        const manifest = app.state.manifest as unknown as AppManifest;
        if (manifest.context) {
          const initModules = configureModules((configurator) => {
            enableContext(configurator, async (builder) => {
              // TODO - check build url and get context from url
              manifest.context?.types && builder.setContextType(manifest.context.types);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              manifest.context?.filterContexts && builder.setContextFilter(manifest.context.filterContexts);
            });
          });
          initModules({ fusion: args.framework, env: { manifest: manifest as any } });
        }
      }
    });

    // args.history.listen(this.ensureCurrentContextExistsInUrl);
  }

  public getCurrentContext(): ContextItem | undefined {
    return this.#framework.modules.context.currentContext;
  }

  public async setCurrentContextAsync(context: string | Context | null): Promise<void> {
    console.log('elg');
    if (context !== null) {
      this.#framework.modules.context.contextClient.setCurrentContext(context as string | ContextItem);
    } else {
      this.#framework.modules.context.clearCurrentContext();
    }
  }

  public async setCurrentContextIdAsync(id: string | null): Promise<void> {
    return this.setCurrentContextAsync(id);
  }

  /**
   * @todo - kill as soon as possible
   */
  private ensureCurrentContextExistsInUrl = async () => {
    // if (!this.appHasContext()) return;
    // const newUrl = await this.buildUrlWithContext();
    // if (newUrl && window.location.pathname.indexOf(newUrl) !== 0) this.history.replace(newUrl);
  };

  getLinkedContextAsync() {
    throw Error('🤷 [getLinkedContextAsync] not implemented/supported, context fusion-core if needed');
  }
  getCurrentContextAsync() {
    throw Error('🤷 [getCurrentContextAsync]  not implemented/supported, context fusion-core if needed');
  }
  getHistory() {
    const value = this.toObject();
    return value?.history || [];
  }
  exchangeContextAsync() {
    throw Error('🤷 [exchangeContextAsync]  not implemented/supported, context fusion-core if needed');
  }
  exchangeCurrentContextAsync() {
    throw Error('🤷 [exchangeCurrentContextAsync]  not implemented/supported, context fusion-core if needed');
  }
}
