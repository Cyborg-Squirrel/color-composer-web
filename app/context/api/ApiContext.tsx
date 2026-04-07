import type { ReactNode } from "react";
import { ClientApiProvider } from "./ClientApiContext";
import { StripApiProvider } from "./StripApiContext";

function ApiContext({ children }: { children: ReactNode }) {
    return <ClientApiProvider>
        <StripApiProvider>
            {children}
        </StripApiProvider>
    </ClientApiProvider>
}

export default ApiContext;