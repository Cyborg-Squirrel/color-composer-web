import React, { createContext, type ReactNode, useContext } from 'react';
import { StripsApiFactory } from '~/api/strips_api.factory';
import type { IStripsApi } from '../../api/strips_api.interface';

interface StripApiContextType {
  stripApi: IStripsApi | null;
}

const StripApiContext = createContext<StripApiContextType | undefined>(undefined);
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

export const StripApiProvider: React.FC<StripApiProviderProps> = ({ children }) => {
  return (
    <StripApiContext.Provider value={{ stripApi: api }}>
      {children}
    </StripApiContext.Provider>
  );
};