
export interface ILedStripClient {
    name: string;
    address: string;
    uuid: string;
    clientType: 'Pi' | 'NightDriver';
    colorOrder: 'RGB' | 'GRB';
    apiPort: number;
    wsPort: number;
    status: ClientStatus;
}

export const enum ClientStatus {
    SetupIncomplete = 'SetupIncomplete',
    Idle = 'Idle',
    Active = 'Active',
    Disconnected = 'Disconnected',
    Error = 'Error'
}

export async function getClients(): Promise<ILedStripClient[]> {
    let apiUrl = import.meta.env.VITE_API_URL;
    let mockMode = import.meta.env.VITE_MOCK_MODE;
    if (mockMode == 'false' && apiUrl != null) {
        const res = await fetch(apiUrl + '/client');
        const json = await res.json();
        const clientList = json.clients.map((c: ILedStripClient) => c);
        return clientList;
    } else {
        if (!apiUrl) {
            console.log('API_URL environment variable is not set. ' + 
                'See https://vite.dev/guide/env-and-mode ' + 
                'on how to configure environment variables.');
        }
        
        // Artificial delay before returning mock content
        await delay(500);
        return [
            {
                name: 'Demo Pi client',
                address: 'http://192.168.1.20',
                uuid: '0efcbf1f-9766-4d60-8b9b-edc4df639998',
                clientType: 'Pi',
                colorOrder: 'GRB',
                apiPort: 8000,
                wsPort: 8765,
                status: ClientStatus.Idle,
            },
            {
                name: 'Demo NightDriver client',
                address: 'http://192.168.1.22',
                uuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf3911',
                clientType: 'NightDriver',
                colorOrder: 'RGB',
                apiPort: 80,
                wsPort: 49152,
                status: ClientStatus.SetupIncomplete,
            }
        ];
    }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}