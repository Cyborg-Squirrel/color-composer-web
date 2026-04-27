import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { EffectApiProvider } from "./EffectApiContext";
import { HomeApiProvider } from "./HomeApiContext";
import { PaletteApiProvider } from "./PaletteApiContext";
import { StripApiProvider } from "./StripApiContext";

function ApiProvider({ children }: { children: ReactNode }) {
    return <HomeApiProvider>
        <ClientApiProvider>
            <StripApiProvider>
                <EffectApiProvider>
                    <PaletteApiProvider>
                        {children}
                    </PaletteApiProvider>
                </EffectApiProvider>
            </StripApiProvider>
        </ClientApiProvider>
    </HomeApiProvider>
}

export default ApiProvider;