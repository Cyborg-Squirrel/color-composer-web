import { createContext, useContext, useEffect, useMemo, type FC, type ReactNode } from 'react';
import type { EventHandler, EventResource, IServerEvent } from '~/api/events/events_api';
import { eventTouches } from '~/api/events/events_api';
import { EventsApiFactory } from '~/api/events/events_api.factory';
import type { IEventsApi } from '~/api/events/events_api.interface';

const EventStreamContext = createContext<IEventsApi | undefined>(undefined);

export const useEventStream = () => {
  const ctx = useContext(EventStreamContext);
  if (!ctx) throw new Error('useEventStream must be used within EventStreamProvider');
  return ctx;
};

/**
 * Subscribe to server events that affect a specific resource.
 * Convenience hook so pages don't have to filter manually.
 */
export function useResourceEvents(
  resources: EventResource | EventResource[],
  handler: EventHandler,
  deps: ReadonlyArray<unknown> = [],
) {
  const stream = useEventStream();
  const watched = Array.isArray(resources) ? resources : [resources];
  useEffect(() => {
    return stream.subscribe((event: IServerEvent) => {
      if (watched.some(r => eventTouches(event, r))) handler(event);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, ...deps]);
}

export const EventStreamProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const api = useMemo(() => EventsApiFactory.create(), []);
  return <EventStreamContext.Provider value={api}>{children}</EventStreamContext.Provider>;
};
