import type { IPoolsApi } from './pools_api.interface';
import { MockPoolsApi } from './pools_api.mock';
import { RealPoolsApi } from './pools_api.real';

export class PoolsApiFactory {
  static create(): IPoolsApi {
    if (import.meta.env.VITE_MOCK_MODE === 'true') return new MockPoolsApi();
    return new RealPoolsApi();
  }
}
