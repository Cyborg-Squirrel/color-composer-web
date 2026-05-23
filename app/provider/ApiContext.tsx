import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { EffectApiProvider } from "./EffectApiContext";
import { EventStreamProvider } from "./EventStreamContext";
import { HomeApiProvider } from "./HomeApiContext";
import { PaletteApiProvider } from "./PaletteApiContext";
import { PoolApiProvider } from "./PoolApiContext";
import { StripApiProvider } from "./StripApiContext";

function ApiProvider({ children }: { children: ReactNode }) {
    return <EventStreamProvider>
        <HomeApiProvider>
            <ClientApiProvider>
                <StripApiProvider>
                    <PoolApiProvider>
                        <EffectApiProvider>
                            <PaletteApiProvider>
                                {children}
                            </PaletteApiProvider>
                        </EffectApiProvider>
                    </PoolApiProvider>
                </StripApiProvider>
            </ClientApiProvider>
        </HomeApiProvider>
    </EventStreamProvider>
}

export default ApiProvider;
