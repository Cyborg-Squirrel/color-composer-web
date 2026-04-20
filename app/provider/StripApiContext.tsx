import { createContext, useContext, type FC, type ReactNode } from 'react';
import { StripsApiFactory } from '~/api/strips/strips_api.factory';
import type { IStripsApi } from '../api/strips/strips_api.interface';

const StripApiContext = createContext<IStripsApi | undefined>(undefined);
const api = StripsApiFactory.create();

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
  return (
    <StripApiContext.Provider value={api}>
      {children}
    </StripApiContext.Provider>
  );
};