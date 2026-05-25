import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { EffectSettingsApiFactory } from '~/api/effect_settings/effect_settings_api.factory';
import type { IEffectSettingsApi } from '~/api/effect_settings/effect_settings_api.interface';

const EffectSettingsApiContext = createContext<IEffectSettingsApi | undefined>(undefined);

export const useEffectSettingsApi = () => {
  const context = useContext(EffectSettingsApiContext);
  if (!context) {
    throw new Error('useEffectSettingsApi must be used within an EffectSettingsApiProvider');
  }
  return context;
};

interface EffectSettingsApiProviderProps {
  children: ReactNode;
}

export const EffectSettingsApiProvider: FC<EffectSettingsApiProviderProps> = ({ children }) => {
  const api = useMemo(() => EffectSettingsApiFactory.create(), []);
  return (
    <EffectSettingsApiContext.Provider value={api}>
      {children}
    </EffectSettingsApiContext.Provider>
  );
};
