import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { PoolsApiFactory } from '~/api/pools/pools_api.factory';
import type { IPoolsApi } from '~/api/pools/pools_api.interface';

const PoolApiContext = createContext<IPoolsApi | undefined>(undefined);

export const usePoolApi = () => {
  const ctx = useContext(PoolApiContext);
  if (!ctx) throw new Error('usePoolApi must be used within a PoolApiProvider');
  return ctx;
};

export const PoolApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const api = useMemo(() => PoolsApiFactory.create(), []);
  return <PoolApiContext.Provider value={api}>{children}</PoolApiContext.Provider>;
};
