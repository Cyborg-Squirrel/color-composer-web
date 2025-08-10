import { SimpleGrid, Stack } from "@mantine/core";

interface ClientGridProps {}

export function ClientGrid(props: ClientGridProps) {
    return (
        <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'md' }}>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="md"
            >
            </Stack>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="md"
            >
            </Stack>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="md"
            >
            </Stack>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="center"
            gap="md"
            >
            </Stack>
        </SimpleGrid>
    );
}