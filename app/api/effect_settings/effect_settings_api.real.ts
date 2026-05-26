import type { ILightEffectSettings, ILightEffectSettingsMutation } from './effect_settings_api';
import type { IEffectSettingsApi } from './effect_settings_api.interface';

export class RealEffectSettingsApi implements IEffectSettingsApi {
    private apiUrl: string | null = null;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || null;
    }

    async getEffectSettings(): Promise<ILightEffectSettings[]> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set. ' +
                'See https://vite.dev/guide/env-and-mode ' +
                'on how to configure environment variables.');
            return [];
        }

        const res = await fetch(this.apiUrl + '/effect/settings');
        if (!res.ok) {
            throw new Error(`Failed to fetch effect settings: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        return json.effectSettings.map((s: ILightEffectSettings) => s);
    }

    async createEffectSettings(data: ILightEffectSettingsMutation): Promise<string> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return '';
        }

        const res = await fetch(this.apiUrl + '/effect/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: data.type,
                name: data.name,
                settings: data.settings || {},
                isDefault: data.isDefault ?? false,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to create effect settings: ${res.status} ${res.statusText}`);
        }

        return res.text();
    }

    async updateEffectSettings(uuid: string, data: Partial<ILightEffectSettingsMutation>): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/effect/settings/' + uuid, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                settings: data.settings,
                isDefault: data.isDefault,
            })
        });

        if (!res.ok) {
            throw new Error(`Failed to update effect settings: ${res.status} ${res.statusText}`);
        }
    }

    async deleteEffectSettings(uuid: string): Promise<void> {
        if (!this.apiUrl) {
            console.log('API_URL environment variable is not set.');
            return;
        }

        const res = await fetch(this.apiUrl + '/effect/settings/' + uuid, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete effect settings: ${res.status} ${res.statusText}`);
        }
    }
}
