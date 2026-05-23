import type { IEventsApi } from './events_api.interface';
import { MockEventsApi } from './events_api.mock';
import { RealEventsApi } from './events_api.real';

export class EventsApiFactory {
  static create(): IEventsApi {
    if (import.meta.env.VITE_MOCK_MODE === 'true') return new MockEventsApi();
    return new RealEventsApi();
  }
}
