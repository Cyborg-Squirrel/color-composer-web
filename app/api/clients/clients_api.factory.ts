import type { IClientsApi } from './clients_api.interface';
import { MockClientsApi } from './clients_api.mock';
import { RealClientsApi } from './clients_api.real';

export class ClientsApiFactory {
  static create(): IClientsApi {
    const mockMode = import.meta.env.VITE_MOCK_MODE;
    
    if (mockMode === 'true') {
      return new MockClientsApi();
    }
    
    return new RealClientsApi();
  }
}