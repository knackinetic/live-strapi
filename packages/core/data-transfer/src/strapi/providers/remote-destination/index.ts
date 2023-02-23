import { WebSocket } from 'ws';
import { v4 } from 'uuid';
import { Writable } from 'stream';
import { once } from 'lodash/fp';

import { createDispatcher } from './utils';

import type {
  IDestinationProvider,
  IEntity,
  ILink,
  IMetadata,
  ProviderType,
  IConfiguration,
  IAsset,
} from '../../../../types';
import type { client, server } from '../../../../types/remote/protocol';
import type { ILocalStrapiDestinationProviderOptions } from '../local-destination';
import { TRANSFER_PATH } from '../../remote/constants';
import { ProviderTransferError, ProviderValidationError } from '../../../errors/providers';

interface ITransferTokenAuth {
  type: 'token';
  token: string;
}

export interface IRemoteStrapiDestinationProviderOptions
  extends Pick<ILocalStrapiDestinationProviderOptions, 'restore' | 'strategy'> {
  url: URL;
  auth?: ITransferTokenAuth;
}

class RemoteStrapiDestinationProvider implements IDestinationProvider {
  name = 'destination::remote-strapi';

  type: ProviderType = 'destination';

  options: IRemoteStrapiDestinationProviderOptions;

  ws: WebSocket | null;

  dispatcher: ReturnType<typeof createDispatcher> | null;

  constructor(options: IRemoteStrapiDestinationProviderOptions) {
    this.options = options;
    this.ws = null;
    this.dispatcher = null;
  }

  async initTransfer(): Promise<string> {
    const { strategy, restore } = this.options;

    // Wait for the connection to be made to the server, then init the transfer
    return new Promise<string>((resolve, reject) => {
      this.ws
        ?.once('open', async () => {
          const query = this.dispatcher?.dispatchCommand({
            command: 'init',
            params: { options: { strategy, restore }, transfer: 'push' },
          });

          const res = (await query) as server.Payload<server.InitMessage>;

          if (!res?.transferID) {
            return reject(
              new ProviderTransferError('Init failed, invalid response from the server')
            );
          }

          resolve(res.transferID);
        })
        .once('error', reject);
    });
  }

  #startStepOnce(stage: client.TransferPushStep) {
    return once(() => this.#startStep(stage));
  }

  async #startStep<T extends client.TransferPushStep>(step: T) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: 'start', step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }

      if (typeof e === 'string') {
        return new ProviderTransferError(e);
      }

      return new ProviderTransferError('Unexpected error');
    }

    return null;
  }

  async #endStep<T extends client.TransferPushStep>(step: T) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: 'end', step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }

      if (typeof e === 'string') {
        return new ProviderTransferError(e);
      }

      return new ProviderTransferError('Unexpected error');
    }

    return null;
  }

  async #streamStep<T extends client.TransferPushStep>(
    step: T,
    data: client.GetTransferPushStreamData<T>
  ) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: 'stream', step, data });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }

      if (typeof e === 'string') {
        return new ProviderTransferError(e);
      }

      return new ProviderTransferError('Unexpected error');
    }

    return null;
  }

  async bootstrap(): Promise<void> {
    const { url, auth } = this.options;
    const validProtocols = ['https:', 'http:'];

    let ws: WebSocket;

    if (!validProtocols.includes(url.protocol)) {
      throw new ProviderValidationError(`Invalid protocol "${url.protocol}"`, {
        check: 'url',
        details: {
          protocol: url.protocol,
          validProtocols,
        },
      });
    }
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${url.host}${url.pathname}${TRANSFER_PATH}`;
    // No auth defined, trying public access for transfer
    if (!auth) {
      ws = new WebSocket(wsUrl);
    }

    // Common token auth, this should be the main auth method
    else if (auth.type === 'token') {
      const headers = { Authorization: `Bearer ${auth.token}` };
      ws = new WebSocket(wsUrl, { headers });
    }

    // Invalid auth method provided
    else {
      throw new ProviderValidationError('Auth method not available', {
        check: 'auth.type',
        details: {
          auth: auth.type,
        },
      });
    }

    this.ws = ws;
    this.dispatcher = createDispatcher(this.ws);

    const transferID = await this.initTransfer();

    this.dispatcher.setTransferProperties({ id: transferID, kind: 'push' });

    await this.dispatcher.dispatchTransferAction('bootstrap');
  }

  async close() {
    await this.dispatcher?.dispatchTransferAction('close');

    await new Promise<void>((resolve) => {
      const { ws } = this;

      if (!ws || ws.CLOSED) {
        resolve();
        return;
      }

      ws.on('close', () => resolve()).close();
    });
  }

  getMetadata() {
    return this.dispatcher?.dispatchTransferAction<IMetadata>('getMetadata') ?? null;
  }

  async beforeTransfer() {
    await this.dispatcher?.dispatchTransferAction('beforeTransfer');
  }

  getSchemas(): Promise<Strapi.Schemas | null> {
    if (!this.dispatcher) {
      return Promise.resolve(null);
    }

    return this.dispatcher.dispatchTransferAction<Strapi.Schemas>('getSchemas');
  }

  createEntitiesWriteStream(): Writable {
    const chunkSize = 100;
    let entities: IEntity[] = [];
    const startEntitiesTransferOnce = this.#startStepOnce('entities');

    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (entities.length > 0) {
          const streamError = await this.#streamStep('entities', entities);
          entities = [];
          if (streamError) {
            return callback(streamError);
          }
        }
        const e = await this.#endStep('entities');

        callback(e);
      },
      write: async (entity: IEntity, _encoding, callback) => {
        const startError = await startEntitiesTransferOnce();
        if (startError) {
          return callback(startError);
        }
        entities.push(entity);
        if (entities.length === chunkSize) {
          const streamError = await this.#streamStep('entities', entities);
          if (streamError) {
            return callback(streamError);
          }
          entities = [];
        }
        callback();
      },
    });
  }

  createLinksWriteStream(): Writable {
    const chunkSize = 100;
    let links: ILink[] = [];
    const startLinksTransferOnce = this.#startStepOnce('links');

    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (links.length > 0) {
          const streamError = await this.#streamStep('links', links);

          if (streamError) {
            return callback(streamError);
          }
          links = [];
        }
        const e = await this.#endStep('links');

        callback(e);
      },
      write: async (link: ILink, _encoding, callback) => {
        const startError = await startLinksTransferOnce();

        if (startError) {
          return callback(startError);
        }

        if (links.length === chunkSize) {
          const streamError = await this.#streamStep('links', links);

          if (streamError) {
            return callback(streamError);
          }
          links = [];
        }
        callback();
      },
    });
  }

  createConfigurationWriteStream(): Writable {
    const chunkSize = 100;
    let configurations: IConfiguration[] = [];
    const startConfigurationTransferOnce = this.#startStepOnce('configuration');

    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (configurations.length > 0) {
          const streamError = await this.#streamStep('configuration', configurations);

          if (streamError) {
            return callback(streamError);
          }
          configurations = [];
        }
        const e = await this.#endStep('configuration');

        callback(e);
      },
      write: async (configuration: IConfiguration, _encoding, callback) => {
        const startError = await startConfigurationTransferOnce();

        if (startError) {
          return callback(startError);
        }

        configurations.push(configuration);
        if (configurations.length === chunkSize) {
          const streamError = await this.#streamStep('configuration', configurations);

          if (streamError) {
            return callback(streamError);
          }
          configurations = [];
        }

        callback();
      },
    });
  }

  createAssetsWriteStream(): Writable | Promise<Writable> {
    let batch: client.TransferAssetFlow[] = [];
    const batchSize = 100;
    const startAssetsTransferOnce = this.#startStepOnce('assets');

    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (batch.length > 0) {
          await this.#streamStep('assets', batch);
          batch = [];
        }
        // TODO: replace this stream call by an end call
        const endError = await this.#streamStep('assets', null);

        if (endError) {
          return callback(endError);
        }

        const endStepError = await this.#endStep('assets');

        if (endStepError) {
          return callback(endStepError);
        }

        return callback(null);
      },

      write: async (asset: IAsset, _encoding, callback) => {
        const startError = await startAssetsTransferOnce();

        if (startError) {
          return callback(startError);
        }

        const { filename, filepath, stats, stream } = asset;
        const assetID = v4();
        batch.push({
          action: 'start',
          assetID,
          data: { filename, filepath, stats },
        });
        if (batch.length === batchSize) {
          await this.#streamStep('assets', batch);
          batch = [];
        }

        for await (const chunk of stream) {
          batch.push({ action: 'stream', assetID, data: chunk });
          if (batch.length === batchSize) {
            await this.#streamStep('assets', batch);
            batch = [];
          }
        }

        batch.push({
          action: 'end',
          assetID,
        });
        if (batch.length === batchSize) {
          await this.#streamStep('assets', batch);
          batch = [];
        }

        callback();
      },
    });
  }
}

export const createRemoteStrapiDestinationProvider = (
  options: IRemoteStrapiDestinationProviderOptions
) => {
  return new RemoteStrapiDestinationProvider(options);
};
