import { useComputedColorScheme } from "@mantine/core";

export function isLightModeUi(): boolean {
    return useComputedColorScheme('light', { getInitialValueInEffect: true }) === 'light';
}
