import type { EventHandler } from './events_api';
import type { IEventsApi } from './events_api.interface';

/**
 * No-op implementation: mock mode runs entirely in-browser, so there
 * is no server pushing events. Components still subscribe; they just
 * never receive anything and refresh on their own actions.
 */
export class MockEventsApi implements IEventsApi {
  subscribe(_handler: EventHandler): () => void {
    return () => { /* no-op */ };
  }
}
