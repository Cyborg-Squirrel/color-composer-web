import type { ILightEffect, ILightEffectMutation, LightEffectStatusCommand } from './effects_api';
import type { IEffectsApi } from './effects_api.interface';

export class MockEffectsApi implements IEffectsApi {
    private effects: ILightEffect[] = [
        {
            uuid: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Rainbow Wave',
            type: 'rainbow',
            stripUuid: '550e8400-e29b-41d4-a716-446655440011',
            status: 'Playing',
            settings: { speed: 0.5 },
            paletteUuid: '550e8400-e29b-41d4-a716-446655550001',
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Solid Color',
            type: 'solid',
            stripUuid: '550e8400-e29b-41d4-a716-446655440011',
            status: 'Paused',
            settings: { color: '#FF0000' },
            paletteUuid: '550e8400-e29b-41d4-a716-446655550002',
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Pulse Effect',
            type: 'pulse',
            stripUuid: '550e8400-e29b-41d4-a716-446655440012',
            status: 'Idle',
            settings: { intensity: 0.8 },
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
            settings: data.settings || {},
            status: 'Idle',
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
                settings: data.settings ?? effect.settings,
            };
        }
    }

    async deleteEffect(uuid: string): Promise<void> {
        await this.delay(500);
        this.effects = this.effects.filter(e => e.uuid !== uuid);
    }

    async updateEffectStatus(uuids: string[], command: LightEffectStatusCommand): Promise<void> {
        await this.delay(500);
        const statusMap: Record<LightEffectStatusCommand, 'Playing' | 'Paused' | 'Stopped'> = {
            'Play': 'Playing',
            'Pause': 'Paused',
            'Stop': 'Stopped',
        };
        const newStatus = statusMap[command];
        for (const uuid of uuids) {
            const effect = this.effects.find(e => e.uuid === uuid);
            if (effect) {
                effect.status = newStatus;
            }
        }
    }
}
