import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { EffectsApiFactory } from '~/api/effects/effects_api.factory';
import type { IEffectsApi } from '../api/effects/effects_api.interface';

const EffectApiContext = createContext<IEffectsApi | undefined>(undefined);

export const useEffectApi = () => {
  const context = useContext(EffectApiContext);
  if (!context) {
    throw new Error('useEffectApi must be used within a EffectApiProvider');
  }
  return context;
};

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
