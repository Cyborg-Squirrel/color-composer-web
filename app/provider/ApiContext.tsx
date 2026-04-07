import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { StripApiProvider } from "./StripApiContext";

function ApiProvider({ children }: { children: ReactNode }) {
    return <ClientApiProvider>
        <StripApiProvider>
            {children}
        </StripApiProvider>
    </ClientApiProvider>
}

export default ApiProvider;