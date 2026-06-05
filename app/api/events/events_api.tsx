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

export interface IServerEvent<TData = unknown> {
  uuid: string;
  type: ServerEventType;
  /**
   * Payload describing the change (see API.md `GET /events`):
   * - `*Created` → the full resource object, identical to its `GET` endpoint.
   * - `*Updated` → a *delta* carrying only the fields that changed.
   * - `*Deleted` → omitted.
   *
   * Deltas omit null fields, so a *cleared* value (e.g. unassigning a palette)
   * is not reported — treat an absent field as "unchanged".
   */
  data?: TData;
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

/**
 * Apply a server event to an in-memory list of resources, returning a new
 * array — safe to drop straight into a `setState` updater:
 *
 *   setItems(prev => applyEventToList(prev, event));
 *
 * Mirrors the SSE contract:
 * - `*Created` appends `event.data` (replacing any entry with the same uuid, so
 *   replayed/duplicate creates are idempotent).
 * - `*Updated` merges the delta into the matching entry; omitted fields are
 *   left unchanged.
 * - `*Deleted` removes the entry.
 *
 * An update for a uuid that isn't in the list is ignored: these full-list views
 * always hold every item, and a delta can't reconstruct a missing one.
 */
export function applyEventToList<T extends { uuid: string }>(
  list: T[],
  event: IServerEvent,
): T[] {
  if (event.type.endsWith('Deleted')) {
    return list.filter(item => item.uuid !== event.uuid);
  }
  if (event.data == null) return list;
  if (event.type.endsWith('Created')) {
    const created = event.data as T;
    return list.some(item => item.uuid === event.uuid)
      ? list.map(item => (item.uuid === event.uuid ? created : item))
      : [...list, created];
  }
  // *Updated — merge the delta into the existing entry.
  return list.map(item =>
    item.uuid === event.uuid ? { ...item, ...(event.data as Partial<T>) } : item,
  );
}
