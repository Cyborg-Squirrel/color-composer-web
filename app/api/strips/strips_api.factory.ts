import type { IStripsApi } from './strips_api.interface';
import { MockStripsApi } from './strips_api.mock';
import { RealStripsApi } from './strips_api.real';

export class StripsApiFactory {
  static create(): IStripsApi {
    const mockMode = import.meta.env.VITE_MOCK_MODE;
    
    if (mockMode === 'true') {
      return new MockStripsApi();
    }
    
    // Default to real implementation
    return new RealStripsApi();
  }
}