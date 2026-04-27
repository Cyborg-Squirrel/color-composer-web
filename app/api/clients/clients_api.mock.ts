import { ClientStatus, type ILedStripClient, type ILedStripClientMutation } from './clients_api';
import type { IClientsApi } from './clients_api.interface';

export class MockClientsApi implements IClientsApi {
    private clients: ILedStripClient[] = [
        {
            name: 'CC client',
            address: 'http://192.168.1.20',
            uuid: '0efcbf1f-9766-4d60-8b9b-edc4df639998',
            clientType: 'Pi',
            colorOrder: 'GRB',
            apiPort: 8000,
            wsPort: 8765,
            lastSeenAt: Date.now(),
            status: ClientStatus.Idle,
            activeEffects: 0,
            powerLimit: 500,
        },
        {
            name: 'NightDriver client',
            address: 'http://192.168.1.22',
            uuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf3911',
            clientType: 'NightDriver',
            colorOrder: 'RGB',
            apiPort: 80,
            wsPort: 49152,
            lastSeenAt: Date.now() - 100000,
            status: ClientStatus.SetupIncomplete,
            activeEffects: 0,
            powerLimit: null,
        },
        {
            name: 'CC offline client',
            address: 'http://192.168.1.50',
            uuid: '2a103a1c-d3b6-4b2d-bc6d-1cb852d82d4b',
            clientType: 'Pi',
            colorOrder: 'RGB',
            apiPort: 80,
            wsPort: 49152,
            lastSeenAt: Date.now() - 1000 * 60 * 60 * 24,
            status: ClientStatus.Offline,
            activeEffects: 0,
            powerLimit: null,
        }
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getClients(): Promise<ILedStripClient[]> {
        // Artificial delay before returning mock content
        await this.delay(500);
        return [...this.clients];
    }

    async updateClient(client: ILedStripClientMutation & { uuid: string }): Promise<void> {
        // Artificial delay before returning mock content
        await this.delay(500);

        const index = this.clients.findIndex(c => c.uuid === client.uuid);
        if (index !== -1) {
            this.clients[index] = {
                ...this.clients[index],
                ...client
            };
        }
    }

    async deleteClient(uuid: string): Promise<void> {
        await this.delay(500);
        this.clients = this.clients.filter(c => c.uuid !== uuid);
    }

    async createClient(client: ILedStripClientMutation): Promise<string> {
        // Artificial delay
        await this.delay(500);

        const newClient: ILedStripClient = {
            ...client,
            uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
            lastSeenAt: Date.now(),
            status: ClientStatus.Idle,
            activeEffects: 0,
        };

        this.clients.push(newClient);
        return newClient.uuid;
    }
}