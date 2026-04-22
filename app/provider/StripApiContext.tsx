import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { StripsApiFactory } from '~/api/strips/strips_api.factory';
import type { IStripsApi } from '../api/strips/strips_api.interface';

const StripApiContext = createContext<IStripsApi | undefined>(undefined);

export const useStripApi = () => {
  const context = useContext(StripApiContext);
  if (!context) {
    throw new Error('useStripApi must be used within a StripApiProvider');
  }
  return context;
};

interface StripApiProviderProps {
  children: ReactNode;
}

export const StripApiProvider: FC<StripApiProviderProps> = ({ children }) => {
  const api = useMemo(() => StripsApiFactory.create(), []);
  return (
    <StripApiContext.Provider value={api}>
      {children}
    </StripApiContext.Provider>
  );
};