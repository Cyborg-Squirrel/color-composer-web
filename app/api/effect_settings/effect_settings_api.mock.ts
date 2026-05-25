import type { ILightEffectSettings, ILightEffectSettingsMutation } from './effect_settings_api';
import type { IEffectSettingsApi } from './effect_settings_api.interface';

export class MockEffectSettingsApi implements IEffectSettingsApi {
    private effectSettings: ILightEffectSettings[] = [
        {
            uuid: '550e8400-e29b-41d4-a716-446655660001',
            type: 'Solid',
            name: 'Warm White',
            settings: { color: '#fff2cc' },
            isDefault: true,
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655660002',
            type: 'Rainbow',
            name: 'Slow Cycle',
            settings: { speed: 25, reverse: false },
            isDefault: true,
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655660003',
            type: 'Breathe',
            name: 'Ocean Pulse',
            settings: { color: '#1f7fff', speed: 30 },
            isDefault: false,
        },
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getEffectSettings(): Promise<ILightEffectSettings[]> {
        await this.delay(500);
        return [...this.effectSettings];
    }

    async createEffectSettings(data: ILightEffectSettingsMutation): Promise<string> {
        await this.delay(500);
        const isDefault = data.isDefault ?? false;
        if (isDefault) {
            for (const s of this.effectSettings) {
                if (s.type === data.type) s.isDefault = false;
            }
        }
        const created: ILightEffectSettings = {
            uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
            type: data.type,
            name: data.name,
            settings: data.settings || {},
            isDefault,
        };
        this.effectSettings.push(created);
        return created.uuid;
    }

    async updateEffectSettings(uuid: string, data: Partial<ILightEffectSettingsMutation>): Promise<void> {
        await this.delay(500);
        const index = this.effectSettings.findIndex(s => s.uuid === uuid);
        if (index === -1) return;
        const current = this.effectSettings[index];
        if (data.isDefault === true) {
            for (const s of this.effectSettings) {
                if (s.type === current.type && s.uuid !== uuid) s.isDefault = false;
            }
        }
        this.effectSettings[index] = {
            ...current,
            name: data.name ?? current.name,
            settings: data.settings ?? current.settings,
            isDefault: data.isDefault ?? current.isDefault,
        };
    }

    async deleteEffectSettings(uuid: string): Promise<void> {
        await this.delay(500);
        this.effectSettings = this.effectSettings.filter(s => s.uuid !== uuid);
    }
}
