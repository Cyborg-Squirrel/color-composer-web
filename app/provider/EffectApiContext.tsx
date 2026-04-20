import { createContext, useContext, type FC, type ReactNode } from 'react';
import { EffectsApiFactory } from '~/api/effects/effects_api.factory';
import type { IEffectsApi } from '../api/effects/effects_api.interface';

interface EffectApiContextType {
  effectApi: IEffectsApi | null;
}

const EffectApiContext = createContext<EffectApiContextType | undefined>(undefined);
const api = EffectsApiFactory.create();

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
  return (
    <EffectApiContext.Provider value={{ effectApi: api }}>
      {children}
    </EffectApiContext.Provider>
  );
};
