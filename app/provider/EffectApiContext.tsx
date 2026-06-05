import { createContext, useContext, useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { EffectsApiFactory } from '~/api/effects/effects_api.factory';
import type { IEffectsApi } from '~/api/effects/effects_api.interface';
import type { IEffectSchema } from '~/api/effects/effects_api';

const EffectApiContext = createContext<IEffectsApi | undefined>(undefined);

export const useEffectApi = () => {
  const context = useContext(EffectApiContext);
  if (!context) {
    throw new Error('useEffectApi must be used within a EffectApiProvider');
  }
  return context;
};

/**
 * Module-level cache for the schemas list. Schemas are immutable for the
 * lifetime of a server process, so one fetch per page session is plenty.
 * The promise is cached so concurrent callers de-dupe.
 */
let cachedSchemasPromise: Promise<IEffectSchema[]> | null = null;

export function useEffectSchemas(): { schemas: IEffectSchema[]; loading: boolean; error: unknown } {
  const api = useEffectApi();
  const [schemas, setSchemas] = useState<IEffectSchema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    if (!cachedSchemasPromise) {
      cachedSchemasPromise = api.getEffectSchemas().catch((err) => {
        // Don't poison the cache — clear it so a later attempt retries.
        cachedSchemasPromise = null;
        throw err;
      });
    }
    cachedSchemasPromise
      .then((res) => { if (!cancelled) { setSchemas(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } });
    return () => { cancelled = true; };
  }, [api]);

  return { schemas, loading, error };
}

interface EffectApiProviderProps {
  children: ReactNode;
}

export const EffectApiProvider: FC<EffectApiProviderProps> = ({ children }) => {
  const api = useMemo(() => EffectsApiFactory.create(), []);
  return (
    <EffectApiContext.Provider value={api}>
      {children}
    </EffectApiContext.Provider>
  );
};
