import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { EffectApiProvider } from "./EffectApiContext";
import { EffectSettingsApiProvider } from "./EffectSettingsApiContext";
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
                            <EffectSettingsApiProvider>
                                <PaletteApiProvider>
                                    {children}
                                </PaletteApiProvider>
                            </EffectSettingsApiProvider>
                        </EffectApiProvider>
                    </PoolApiProvider>
                </StripApiProvider>
            </ClientApiProvider>
        </HomeApiProvider>
    </EventStreamProvider>
}

export default ApiProvider;
