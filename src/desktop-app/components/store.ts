import { decorate, observable } from 'mobx';

import { createContextNoNullCheck } from 'shared/utils/react';

import { Client } from '../../core/client/types';
import { LoadAppConfigQuery, AppConfig } from '../../core/client-types';

export class MainStore {
  client: Client;
  appConfig: AppConfig;

  constructor(client: Client) {
    this.client = client;
    this.appConfig = {
      __typename: 'AppConfig',
      rootPath: '',
    };
  }

  async init(): Promise<void> {
    const res = await this.client.send<LoadAppConfigQuery>({
      query: /* GraphQL */ `
        query LoadAppConfig {
          appConfig {
            rootPath
          }
        }
      `,
    });

    if (res.success) {
      this.appConfig = res.data.appConfig;
    }
  }
}

decorate(MainStore, {
  appConfig: observable,
});

export const [useMainStore, MainStoreContext] = createContextNoNullCheck<MainStore>();
