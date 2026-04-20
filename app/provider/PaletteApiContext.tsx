import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { PalettesApiFactory } from '~/api/palettes/palettes_api.factory';
import type { IPalettesApi } from '../api/palettes/palettes_api.interface';

const PaletteApiContext = createContext<IPalettesApi | undefined>(undefined);

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
  const api = useMemo(() => PalettesApiFactory.create(), []);
  return (
    <PaletteApiContext.Provider value={api}>
      {children}
    </PaletteApiContext.Provider>
  );
};
