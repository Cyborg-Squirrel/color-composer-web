import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function isMobileUi(): boolean {
    return useMediaQuery(`(max-width: ${em(750)})`);
}
