import { useComputedColorScheme } from "@mantine/core";
import { createContext } from "react";

export function isLightModeUi(): boolean {
    return useComputedColorScheme('light', { getInitialValueInEffect: true }) === 'light';
}

export const IsLightModeContext = createContext(true);
