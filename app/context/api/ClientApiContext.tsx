import React, { createContext, type ReactNode, useContext } from 'react';
import { ClientsApiFactory } from '~/api/clients_api.factory';
import type { IClientsApi } from '../../api/clients_api';

const ClientApiContext = createContext<IClientsApi | undefined>(undefined);
const api = ClientsApiFactory.create();

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

export const ClientApiProvider: React.FC<ClientApiProviderProps> = ({ children }) => {
  return (
    <ClientApiContext.Provider value={api}>
      {children}
    </ClientApiContext.Provider>
  );
};