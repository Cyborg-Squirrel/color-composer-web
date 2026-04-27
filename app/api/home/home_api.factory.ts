import type { IHomeApi } from './home_api.interface';
import { MockHomeApi } from './home_api.mock';
import { RealHomeApi } from './home_api.real';

export class HomeApiFactory {
    static create(): IHomeApi {
        return import.meta.env.VITE_MOCK_MODE === 'true'
            ? new MockHomeApi()
            : new RealHomeApi();
    }
}
