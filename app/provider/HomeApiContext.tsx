import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { HomeApiFactory } from '~/api/home/home_api.factory';
import type { IHomeApi } from '~/api/home/home_api.interface';

const HomeApiContext = createContext<IHomeApi | undefined>(undefined);

export const useHomeApi = () => {
    const context = useContext(HomeApiContext);
    if (!context) throw new Error('useHomeApi must be used within a HomeApiProvider');
    return context;
};

export const HomeApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const api = useMemo(() => HomeApiFactory.create(), []);
    return <HomeApiContext.Provider value={api}>{children}</HomeApiContext.Provider>;
};
