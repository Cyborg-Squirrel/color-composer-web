import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { EffectApiProvider } from "./EffectApiContext";
import { PaletteApiProvider } from "./PaletteApiContext";
import { StripApiProvider } from "./StripApiContext";

function ApiProvider({ children }: { children: ReactNode }) {
    return <ClientApiProvider>
        <StripApiProvider>
            <EffectApiProvider>
                <PaletteApiProvider>
                    {children}
                </PaletteApiProvider>
            </EffectApiProvider>
        </StripApiProvider>
    </ClientApiProvider>
}

export default ApiProvider;