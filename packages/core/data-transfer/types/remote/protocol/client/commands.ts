import { ILocalStrapiDestinationProviderOptions } from '../../../../lib';

export type CommandType = 'command';

export type CommandMessage = { type: CommandType } & (InitCommand | EndCommand);

export type InitCommand = CreateCommand<
  'init',
  | {
      transfer: 'push';
      options: Pick<ILocalStrapiDestinationProviderOptions, 'strategy' | 'restore'>;
    }
  | { transfer: 'pull' }
>;

export type EndCommand = CreateCommand<'end', { uid: string }>;

export type StatusCommand = CreateCommand<'status'>;

type CreateCommand<T extends string, U extends Record<string, unknown> = never> = {
  type: 'command';
  command: T;
} & ([U] extends [never] ? unknown : { params: U });
