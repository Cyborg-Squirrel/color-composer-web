// Server-Sent Events (SSE) stream — see API.md `GET /events`.
// All events share the same payload shape; the `type` discriminator
// tells you which resource changed and what the change was.

export type EventResource =
  | 'LedClient'
  | 'LedStrip'
  | 'StripPool'
  | 'LightEffect'
  | 'EffectSettings'
  | 'Palette';

export type EventChange = 'Created' | 'Updated' | 'Deleted';

export type ServerEventType = `${EventResource}${EventChange}`;

export interface IServerEvent {
  uuid: string;
  type: ServerEventType;
}

export type EventHandler = (event: IServerEvent) => void;

export type { IEventsApi } from './events_api.interface';
export { MockEventsApi } from './events_api.mock';
export { RealEventsApi } from './events_api.real';

/**
 * Helper — does this event affect the given resource?
 */
export function eventTouches(event: IServerEvent, resource: EventResource): boolean {
  return event.type.startsWith(resource);
}
