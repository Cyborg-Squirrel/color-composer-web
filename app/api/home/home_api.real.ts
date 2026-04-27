import type { IHomeData } from './home_api';
import type { IHomeApi } from './home_api.interface';

export class RealHomeApi implements IHomeApi {
    private apiUrl: string | null;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || null;
    }

    async getHomeStats(): Promise<IHomeData> {
        if (!this.apiUrl) return { totalClients: 0, totalStrips: 0, totalEffects: 0, totalPalettes: 0, activeEffects: [], strips: [], clients: [] };
        const res = await fetch(this.apiUrl + '/home');
        return res.json();
    }
}
