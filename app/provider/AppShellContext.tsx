import { createContext, useContext } from 'react';

export const AppShellRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const useAppShellRef = () => {
  const ref = useContext(AppShellRefContext);
  return ref;
};
