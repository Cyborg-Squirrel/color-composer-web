import { LightEffectStatus, type IEffectReassign, type IEffectSchema, type ILightEffect, type ILightEffectMutation, type LightEffectStatusCommand } from './effects_api';
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
            layer: 0,
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Solid Color',
            type: 'Solid',
            stripUuid: '13120111-0184-4961-9e74-018a960d4b32',
            status: LightEffectStatus.Paused,
            paletteUuid: '550e8400-e29b-41d4-a716-446655550002',
            layer: 1,
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Breathe',
            type: 'Breathe',
            stripUuid: '99d53b59-cb0d-449f-a9e9-bf6cb7bf391a',
            status: LightEffectStatus.Inactive,
            paletteUuid: null,
            layer: 0,
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
        const siblings = this.effects.filter(e =>
            (data.stripUuid && e.stripUuid === data.stripUuid) ||
            (data.poolUuid && e.poolUuid === data.poolUuid),
        );
        const layer = data.layer ?? (siblings.length === 0
            ? 0
            : Math.max(...siblings.map(e => e.layer)) + 1);
        const newEffect: ILightEffect = {
            uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
            name: data.name,
            type: data.effectType,
            stripUuid: data.stripUuid,
            poolUuid: data.poolUuid,
            paletteUuid: data.paletteUuid,
            settingsUuid: '550e8400-e29b-41d4-a716-446655660001',
            status: LightEffectStatus.Inactive,
            layer,
        };
        this.effects.push(newEffect);
        return newEffect.uuid;
    }

    async updateEffect(uuid: string, data: Partial<ILightEffectMutation>): Promise<void> {
        await this.delay(500);
        const effect = this.effects.find(e => e.uuid === uuid);
        if (!effect) return;
        effect.name = data.name ?? effect.name;
        // A null paletteUuid clears the palette; undefined leaves it unchanged.
        if (data.paletteUuid !== undefined) effect.paletteUuid = data.paletteUuid;
        if (data.settingsUuid !== undefined) effect.settingsUuid = data.settingsUuid;
        if (data.layer !== undefined && data.layer !== null && data.layer !== effect.layer) {
            this.moveLayer(effect, data.layer);
        }
    }

    /** Mirror the backend's "set layer, keep siblings contiguous" reorder. */
    private moveLayer(effect: ILightEffect, targetLayer: number): void {
        const ownerMatch = (e: ILightEffect) =>
            effect.stripUuid ? e.stripUuid === effect.stripUuid : e.poolUuid === effect.poolUuid;
        const siblings = this.effects.filter(ownerMatch).sort((a, b) => a.layer - b.layer);
        const fromIdx = siblings.findIndex(e => e.uuid === effect.uuid);
        if (fromIdx === -1) return;
        const [item] = siblings.splice(fromIdx, 1);
        const clamped = Math.max(0, Math.min(targetLayer, siblings.length));
        siblings.splice(clamped, 0, item);
        siblings.forEach((e, i) => { e.layer = i; });
    }

    async reassignEffect(uuid: string, data: IEffectReassign): Promise<void> {
        await this.delay(500);
        const effect = this.effects.find(e => e.uuid === uuid);
        if (!effect) return;
        if (data.unassign) {
            effect.stripUuid = null;
            effect.poolUuid = null;
            effect.status = LightEffectStatus.Inactive;
        } else if (data.targetStripUuid) {
            effect.stripUuid = data.targetStripUuid;
            effect.poolUuid = null;
        } else if (data.targetPoolUuid) {
            effect.poolUuid = data.targetPoolUuid;
            effect.stripUuid = null;
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
