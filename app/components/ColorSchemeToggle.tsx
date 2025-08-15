import { ActionIcon, Button, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle(props: {hidden: boolean}) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      hidden={props.hidden}
    >
        <Button hidden={computedColorScheme === 'light'} variant="transparent" p='.1em'>☀️</Button>
        <Button hidden={computedColorScheme === 'dark'} variant="transparent" p='.1em'>🌛</Button>
    </ActionIcon>
  );
}