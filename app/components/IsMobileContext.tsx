import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { createContext } from "react";

export function isMobileUi(): boolean {
    return useMediaQuery(`(max-width: ${em(750)})`);
}

export const IsMobileContext = createContext(false);
