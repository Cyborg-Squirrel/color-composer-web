import { LightEffectStatus } from '../effects/effects_api';
import { ClientStatus } from '../clients/clients_api';
import type { IHomeData } from './home_api';
import type { IHomeApi } from './home_api.interface';

export class MockHomeApi implements IHomeApi {
    async getHomeStats(): Promise<IHomeData> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            totalClients: 3,
            totalStrips: 2,
            totalEffects: 5,
            totalPalettes: 3,
            activeEffects: [
                {
                    uuid: 'ae1',
                    name: 'Rainbow Cycle',
                    type: 'RainbowCycle',
                    stripUuid: 'strip-uuid-1',
                    settings: {},
                    status: LightEffectStatus.Playing,
                },
                {
                    uuid: 'ae2',
                    name: 'Color Wipe',
                    type: 'ColorWipe',
                    stripUuid: 'strip-uuid-2',
                    settings: {},
                    status: LightEffectStatus.Playing,
                },
            ],
            strips: [
                { uuid: 'strip-uuid-1', clientUuid: 'client-uuid-1', name: 'Strip A', length: 60, height: 1, brightness: 255, blendMode: 'Layer', activeEffects: 1 },
                { uuid: 'strip-uuid-2', clientUuid: 'client-uuid-2', name: 'Strip B', length: 30, height: 1, brightness: 200, blendMode: 'Layer', activeEffects: 1 },
            ],
            clients: [
                { uuid: 'client-uuid-1', name: 'Pi Client A', address: '192.168.1.10', clientType: 'Pi', colorOrder: 'RGB', apiPort: 8080, wsPort: 8081, lastSeenAt: Date.now(), status: ClientStatus.Active, activeEffects: 1, powerLimit: null },
                { uuid: 'client-uuid-2', name: 'Pi Client B', address: '192.168.1.11', clientType: 'Pi', colorOrder: 'RGB', apiPort: 8080, wsPort: 8081, lastSeenAt: Date.now(), status: ClientStatus.Idle, activeEffects: 0, powerLimit: null },
                { uuid: 'client-uuid-3', name: 'NightDriver C', address: '192.168.1.12', clientType: 'NightDriver', colorOrder: 'GRB', apiPort: 8080, wsPort: 8081, lastSeenAt: Date.now() - 60000, status: ClientStatus.Offline, activeEffects: 0, powerLimit: null },
            ],
        };
    }
}
