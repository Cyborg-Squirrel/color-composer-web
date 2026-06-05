import type { EventHandler, IServerEvent, ServerEventType } from './events_api';
import type { IEventsApi } from './events_api.interface';

const ALL_EVENT_TYPES: ServerEventType[] = [
  'LedClientCreated', 'LedClientUpdated', 'LedClientDeleted',
  'LedStripCreated', 'LedStripUpdated', 'LedStripDeleted',
  'StripPoolCreated', 'StripPoolUpdated', 'StripPoolDeleted',
  'LightEffectCreated', 'LightEffectUpdated', 'LightEffectDeleted',
  'EffectSettingsCreated', 'EffectSettingsUpdated', 'EffectSettingsDeleted',
  'PaletteCreated', 'PaletteUpdated', 'PaletteDeleted',
];

/**
 * Opens an EventSource on first subscription, multiplexes events to
 * all subscribers, and closes the connection when the last subscriber
 * leaves. Survives subscriber churn without dropping a connection.
 */
export class RealEventsApi implements IEventsApi {
  private apiUrl: string | null;
  private source: EventSource | null = null;
  private handlers: Set<EventHandler> = new Set();
  private namedListeners: Array<{ type: ServerEventType; listener: (e: MessageEvent) => void }> = [];

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || null;
  }

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    this.openIfNeeded();
    return () => {
      this.handlers.delete(handler);
      if (this.handlers.size === 0) this.close();
    };
  }

  private openIfNeeded() {
    if (this.source || !this.apiUrl) return;
    const src = new EventSource(this.apiUrl + '/events');

    // The server sets `event:` to the type name, so we have to register
    // a listener per named event type (not just `message`).
    for (const type of ALL_EVENT_TYPES) {
      const listener = (e: MessageEvent) => {
        let payload: IServerEvent;
        try {
          payload = JSON.parse(e.data);
        } catch {
          payload = { uuid: '', type };
        }
        // Guarantee `type` is set even if the server omitted it.
        if (!payload.type) payload.type = type;
        for (const h of this.handlers) {
          try { h(payload); } catch (err) { console.error('Event handler error', err); }
        }
      };
      src.addEventListener(type, listener as EventListener);
      this.namedListeners.push({ type, listener });
    }

    src.onerror = (err) => {
      // EventSource auto-reconnects; just log.
      console.warn('SSE error', err);
    };

    this.source = src;
  }

  private close() {
    if (!this.source) return;
    for (const { type, listener } of this.namedListeners) {
      this.source.removeEventListener(type, listener as EventListener);
    }
    this.namedListeners = [];
    this.source.close();
    this.source = null;
  }
}
