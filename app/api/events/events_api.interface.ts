import type { EventHandler } from './events_api';

export interface IEventsApi {
  /**
   * Subscribe to server events. Returns an unsubscribe function.
   * The implementation lazily opens the underlying connection on first
   * subscriber and closes it when the last subscriber unsubscribes.
   */
  subscribe(handler: EventHandler): () => void;
}
