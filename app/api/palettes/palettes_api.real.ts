import type { IPalette, IPaletteMutation } from './palettes_api';
import type { IPalettesApi } from './palettes_api.interface';

export class RealPalettesApi implements IPalettesApi {
    private apiUrl: string | null = null;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || null;
    }

    async getPalettes(): Promise<IPalette[]> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return [];
        }

        const res = await fetch(this.apiUrl + '/palette');
        // if (!res.ok) {
        //     throw new Error(`Failed to fetch palettes: ${res.status} ${res.statusText}`);
        // }
        const json = await res.json();
        return json.palettes.map((p: IPalette) => p);
    }

    async getPalette(uuid: string): Promise<IPalette> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            throw new Error('API_URL not set');
        }

        const res = await fetch(this.apiUrl + '/palette/' + uuid);
        if (!res.ok) {
            throw new Error(`Failed to fetch palette: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json;
    }

    async createPalette(data: IPaletteMutation): Promise<string> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return '';
        }

        const res = await fetch(this.apiUrl + '/palette', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                paletteType: data.paletteType,
                settings: data.settings || {},
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to create palette: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        return json.uuid;
    }

    async updatePalette(uuid: string, data: Partial<IPaletteMutation>): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/palette/' + uuid, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                settings: data.settings,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to update palette: ${res.status} ${res.statusText}`);
        }
    }

    async deletePalette(uuid: string): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/palette/' + uuid, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete palette: ${res.status} ${res.statusText}`);
        }
    }
}
