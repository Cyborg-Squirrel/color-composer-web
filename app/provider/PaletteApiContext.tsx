import { createContext, useContext, type FC, type ReactNode } from 'react';
import { PalettesApiFactory } from '~/api/palettes/palettes_api.factory';
import type { IPalettesApi } from '../api/palettes/palettes_api.interface';

interface PaletteApiContextType {
  paletteApi: IPalettesApi | null;
}

const PaletteApiContext = createContext<PaletteApiContextType | undefined>(undefined);
const api = PalettesApiFactory.create();

export const usePaletteApi = () => {
  const context = useContext(PaletteApiContext);
  if (!context) {
    throw new Error('usePaletteApi must be used within a PaletteApiProvider');
  }
  return context;
};

interface PaletteApiProviderProps {
  children: ReactNode;
}

export const PaletteApiProvider: FC<PaletteApiProviderProps> = ({ children }) => {
  return (
    <PaletteApiContext.Provider value={{ paletteApi: api }}>
      {children}
    </PaletteApiContext.Provider>
  );
};
