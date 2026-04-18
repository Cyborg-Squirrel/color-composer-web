import { createContext, useContext } from 'react';

export const AppShellRefContext = createContext<React.RefObject<HTMLElement> | null>(null);

export const useAppShellRef = () => {
  const ref = useContext(AppShellRefContext);
  return ref;
};
