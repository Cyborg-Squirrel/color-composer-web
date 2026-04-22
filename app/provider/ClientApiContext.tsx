import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { ClientsApiFactory } from '~/api/clients/clients_api.factory';
import type { IClientsApi } from '../api/clients/clients_api';

const ClientApiContext = createContext<IClientsApi | undefined>(undefined);

export const useClientApi = () => {
  const context = useContext(ClientApiContext);
  if (!context) {
    throw new Error('useClientApi must be used within a ClientApiProvider');
  }
  return context;
};

interface ClientApiProviderProps {
  children: ReactNode;
}

export const ClientApiProvider: FC<ClientApiProviderProps> = ({ children }) => {
  const api = useMemo(() => ClientsApiFactory.create(), []);
  return (
    <ClientApiContext.Provider value={api}>
      {children}
    </ClientApiContext.Provider>
  );
};