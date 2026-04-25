import type { ILedStripClient, ILedStripClientMutation } from './clients_api';
import type { IClientsApi } from './clients_api.interface';

export class RealClientsApi implements IClientsApi {
  private apiUrl: string | null = null;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || null;
  }

  async getClients(): Promise<ILedStripClient[]> {
    if (!this.apiUrl) {
      console.log('API_URL environment variable is not set. ' +
        'See https://vite.dev/guide/env-and-mode ' +
        'on how to configure environment variables.');
      return [];
    }
    
    console.log('Fetching clients from API at ' + this.apiUrl);
    const res = await fetch(this.apiUrl + '/client');
    const json = await res.json();
    const clientList = json.clients.map((c: ILedStripClient) => c);
    return clientList;
  }

  async updateClient(client: ILedStripClientMutation & { uuid: string }): Promise<void> {
    if (!this.apiUrl) {
      console.log('API_URL environment variable is not set. ' +
        'See https://vite.dev/guide/env-and-mode ' +
        'on how to configure environment variables.');
      return;
    }
    
    const res = await fetch(this.apiUrl + '/client/' + client.uuid, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: client.name,
        address: client.address,
        colorOrder: client.colorOrder,
        apiPort: client.apiPort,
        wsPort: client.wsPort,
        powerLimit: client.powerLimit
      })
    });
    
    if (!res.ok) {
      throw new Error(`Failed to update client: ${res.status} ${res.statusText}`);
    }
  }

  async deleteClient(uuid: string): Promise<void> {
    if (!this.apiUrl) return;
    const res = await fetch(this.apiUrl + '/client/' + uuid, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete client: ${res.status}`);
  }

  async createClient(client: ILedStripClientMutation): Promise<string> {
    if (!this.apiUrl) {
      console.log('API_URL environment variable is not set. ' +
        'See https://vite.dev/guide/env-and-mode ' +
        'on how to configure environment variables.');
      return '';
    }
    
    const res = await fetch(this.apiUrl + '/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: client.name,
        address: client.address,
        colorOrder: client.colorOrder,
        apiPort: client.apiPort,
        wsPort: client.wsPort,
        powerLimit: client.powerLimit,
        clientType: client.clientType
      })
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create client: ${res.status} ${res.statusText}`);
    }
    
    const result = await res.json();
    return result.uuid;
  }
}