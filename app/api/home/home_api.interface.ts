import type { IHomeData } from './home_api';

export interface IHomeApi {
    getHomeStats(): Promise<IHomeData>;
}
