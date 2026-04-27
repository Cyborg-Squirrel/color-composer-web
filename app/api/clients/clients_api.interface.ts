import type { ILedStripClient, ILedStripClientMutation } from './clients_api';

export interface IClientsApi {
  getClients(): Promise<ILedStripClient[]>;
  updateClient(client: ILedStripClientMutation & { uuid: string }): Promise<void>;
  createClient(client: ILedStripClientMutation): Promise<string>;
  deleteClient(uuid: string): Promise<void>;
}