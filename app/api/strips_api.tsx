
export const piPins: PiPin[] = ['D10', 'D12', 'D18', 'D21'];
export type PiPin = 'D10' | 'D12' | 'D18' | 'D21';

export interface ILedStrip {
    name: string;
    uuid: string;
    clientUuid: string;
    pin: string;
    length: number;
    brightness: number;
    activeEffects: number;
}

export async function getStrips(): Promise<ILedStrip[]> {
    let apiUrl = import.meta.env.VITE_API_URL;
    let mockMode = import.meta.env.VITE_MOCK_MODE;
    if (mockMode == 'false' && apiUrl != null) {
        const res = await fetch(apiUrl + '/strip');
        const json = await res.json();
        const clientList = json.strips.map((c: ILedStrip) => c);
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
                name: 'Hallway Strip',
                uuid: '13120111-0184-4961-9e74-018a960d4b32',
                clientUuid: '0efcbf1f-9766-4d60-8b9b-edc4df639998',
                pin: 'D10',
                length: 120,
                brightness: 20,
                activeEffects: 2,
            },
            {
                name: 'LED Lamp Strip',
                uuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf391a',
                clientUuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf3911',
                pin: '1',
                length: 80,
                brightness: 34,
                activeEffects: 0,
            }
        ];
    }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}