import { ActionIcon, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle(props: {hidden: boolean}) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isLightMode = colorScheme === 'light';

  return (
    <ActionIcon
      onClick={() => setColorScheme(isLightMode ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      hidden={props.hidden}
    >
      {isLightMode ? '🌛' : '☀️'}
    </ActionIcon>
  );
}