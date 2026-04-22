import type { IPalette, IPaletteMutation } from './palettes_api';
import type { IPalettesApi } from './palettes_api.interface';

export class MockPalettesApi implements IPalettesApi {
    private palettes: IPalette[] = [
        {
            uuid: '550e8400-e29b-41d4-a716-446655550001',
            name: 'Rainbow',
            type: 'spectrum',
            settings: { colors: ['#FF0000', '#00FF00', '#0000FF'] },
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655550002',
            name: 'Cool Tones',
            type: 'custom',
            settings: { colors: ['#0080FF', '#00FFFF', '#0000FF'] },
        },
        {
            uuid: '550e8400-e29b-41d4-a716-446655550003',
            name: 'Warm Tones',
            type: 'custom',
            settings: { colors: ['#FF8000', '#FFFF00', '#FF0000'] },
        },
    ];

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getPalettes(): Promise<IPalette[]> {
        await this.delay(500);
        return [...this.palettes];
    }

    async getPalette(uuid: string): Promise<IPalette> {
        await this.delay(500);
        const palette = this.palettes.find(p => p.uuid === uuid);
        if (!palette) {
            throw new Error(`Palette not found: ${uuid}`);
        }
        return palette;
    }

    async createPalette(data: IPaletteMutation): Promise<string> {
        await this.delay(500);
        const newPalette: IPalette = {
            uuid: 'mock-uuid-' + Math.floor(Math.random() * 10000),
            name: data.name,
            type: data.paletteType,
            settings: data.settings || {},
        };
        this.palettes.push(newPalette);
        return newPalette.uuid;
    }

    async updatePalette(uuid: string, data: Partial<IPaletteMutation>): Promise<void> {
        await this.delay(500);
        const index = this.palettes.findIndex(p => p.uuid === uuid);
        if (index !== -1) {
            const palette = this.palettes[index];
            this.palettes[index] = {
                ...palette,
                name: data.name ?? palette.name,
                type: data.paletteType ?? palette.type,
                settings: data.settings ?? palette.settings,
            };
        }
    }

    async deletePalette(uuid: string): Promise<void> {
        await this.delay(500);
        this.palettes = this.palettes.filter(p => p.uuid !== uuid);
    }
}
