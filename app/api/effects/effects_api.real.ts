import type { ILightEffect, ILightEffectMutation, LightEffectStatusCommand } from './effects_api';
import type { IEffectsApi } from './effects_api.interface';

export class RealEffectsApi implements IEffectsApi {
    private apiUrl: string | null = null;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || null;
    }

    async getEffects(): Promise<ILightEffect[]> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set. ' +
                'See https://vite.dev/guide/env-and-mode ' +
                'on how to configure environment variables.');
            return [];
        }

        console.log('Fetching effects from API at ' + this.apiUrl);
        const res = await fetch(this.apiUrl + '/effect');
        if (!res.ok) {
            throw new Error(`Failed to fetch effects: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.effects.map((e: ILightEffect) => e);
    }

    async getEffectsByStrip(stripUuid: string): Promise<ILightEffect[]> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return [];
        }

        const res = await fetch(this.apiUrl + '/effect?stripUuid=' + stripUuid);
        if (!res.ok) {
            throw new Error(`Failed to fetch effects: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.effects.map((e: ILightEffect) => e);
    }

    async getEffectsByPool(poolUuid: string): Promise<ILightEffect[]> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return [];
        }

        const res = await fetch(this.apiUrl + '/effect?poolUuid=' + poolUuid);
        if (!res.ok) {
            throw new Error(`Failed to fetch effects: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.effects.map((e: ILightEffect) => e);
    }

    async createEffect(data: ILightEffectMutation): Promise<string> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return '';
        }

        const res = await fetch(this.apiUrl + '/effect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                effectType: data.effectType,
                stripUuid: data.stripUuid,
                poolUuid: data.poolUuid,
                settings: data.settings || {},
                paletteUuid: data.paletteUuid,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to create effect: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        return json.uuid;
    }

    async updateEffect(uuid: string, data: Partial<ILightEffectMutation>): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/effect/' + uuid, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                stripUuid: data.stripUuid,
                poolUuid: data.poolUuid,
                paletteUuid: data.paletteUuid,
                settings: data.settings,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to update effect: ${res.status} ${res.statusText}`);
        }
    }

    async deleteEffect(uuid: string): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/effect/' + uuid, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete effect: ${res.status} ${res.statusText}`);
        }
    }

    async updateEffectStatus(uuids: string[], command: LightEffectStatusCommand): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/effect/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuids,
                command,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to update effect status: ${res.status} ${res.statusText}`);
        }
    }
}
