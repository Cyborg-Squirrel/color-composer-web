import type { ILightEffect } from '../effects/effects_api';
import type { ILedStripClient } from '../clients/clients_api';
import type { ILedStrip } from '../strips/strips_api';

export interface IHomeData {
    totalClients: number;
    totalStrips: number;
    totalEffects: number;
    totalPalettes: number;
    activeEffects: ILightEffect[];
    strips: ILedStrip[];
    clients: ILedStripClient[];
}

export type { IHomeApi } from './home_api.interface';
export { MockHomeApi } from './home_api.mock';
export { RealHomeApi } from './home_api.real';
