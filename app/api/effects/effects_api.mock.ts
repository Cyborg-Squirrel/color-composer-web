import { LightEffectStatus, type IEffectSchema, type ILightEffect, type ILightEffectMutation, type LightEffectStatusCommand } from './effects_api';
import type { IEffectsApi } from './effects_api.interface';
import { MOCK_EFFECT_SCHEMAS } from './effects_api.mock_schemas';

export class MockEffectsApi implements IEffectsApi {
    private effects: ILightEffect[] = [
        {
            uuid: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Rainbow Wave',
            type: 'Rainbow',
            stripUuid: '13120111-0184-4961-9e74-018a960d4b32',
            status: LightEffectStatus.Playing,
            paletteUuid: '550e8400-e29b-41d4-a716-446655550001',
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Solid Color',
            type: 'Solid',
            stripUuid: '13120111-0184-4961-9e74-018a960d4b32',
            status: LightEffectStatus.Paused,
            paletteUuid: '550e8400-e29b-41d4-a716-446655550002',
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Breathe',
            type: 'Breathe',
            stripUuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf391a',
            status: LightEffectStatus.Inactive,
            paletteUuid: null,
        },
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getEffects(): Promise<ILightEffect[]> {
        await this.delay(500);
        return [...this.effects];
    }

    async getEffectsByStrip(stripUuid: string): Promise<ILightEffect[]> {
        await this.delay(500);
        return this.effects.filter(e => e.stripUuid === stripUuid);
    }

    async getEffectsByPool(poolUuid: string): Promise<ILightEffect[]> {
        await this.delay(500);
        return this.effects.filter(e => e.poolUuid === poolUuid);
    }

    async createEffect(data: ILightEffectMutation): Promise<string> {
        await this.delay(500);
        const newEffect: ILightEffect = {
            uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
            name: data.name,
            type: data.effectType,
            stripUuid: data.stripUuid,
            poolUuid: data.poolUuid,
            paletteUuid: data.paletteUuid,
            settingsUuid: '550e8400-e29b-41d4-a716-446655660001',
            status: LightEffectStatus.Inactive,
        };
        this.effects.push(newEffect);
        return newEffect.uuid;
    }

    async updateEffect(uuid: string, data: Partial<ILightEffectMutation>): Promise<void> {
        await this.delay(500);
        const index = this.effects.findIndex(e => e.uuid === uuid);
        if (index !== -1) {
            const effect = this.effects[index];
            this.effects[index] = {
                ...effect,
                name: data.name ?? effect.name,
                type: data.effectType ?? effect.type,
                stripUuid: data.stripUuid ?? effect.stripUuid,
                poolUuid: data.poolUuid ?? effect.poolUuid,
                paletteUuid: data.paletteUuid ?? effect.paletteUuid,
                settingsUuid: data.settingsUuid ?? effect.settingsUuid,
            };
        }
    }

    async deleteEffect(uuid: string): Promise<void> {
        await this.delay(500);
        this.effects = this.effects.filter(e => e.uuid !== uuid);
    }

    async updateEffectStatus(uuids: string[], command: LightEffectStatusCommand): Promise<void> {
        await this.delay(500);
        const statusMap: Record<LightEffectStatusCommand, LightEffectStatus> = {
            'Play': LightEffectStatus.Playing,
            'Pause': LightEffectStatus.Paused,
            'Stop': LightEffectStatus.Stopped,
            'Deactivate': LightEffectStatus.Inactive,
        };
        const newStatus = statusMap[command];
        for (const uuid of uuids) {
            const effect = this.effects.find(e => e.uuid === uuid);
            if (effect) {
                effect.status = newStatus;
            }
        }
    }

    async getEffectSchemas(): Promise<IEffectSchema[]> {
        await this.delay(200);
        return MOCK_EFFECT_SCHEMAS.map(s => ({ ...s, fields: s.fields.map(f => ({ ...f, validators: [...f.validators] })) }));
    }
}
