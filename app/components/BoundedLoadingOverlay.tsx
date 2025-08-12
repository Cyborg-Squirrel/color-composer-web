import { Box, LoadingOverlay } from "@mantine/core";

interface ILoadingOverlayProps {
    loading: boolean;
}

export function BoundedLoadingOverlay(props: ILoadingOverlayProps) {
    return <Box
    style={{
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'visible',
        padding: 20,
        minHeight: 300,
    }}
    >
        <LoadingOverlay visible={ props.loading } zIndex={ 1000 } overlayProps={{ backgroundOpacity:0 }} loaderProps={{ type: 'bars' }} />
        </Box>
}