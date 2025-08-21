import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useContext } from 'react';
import { IsLightModeContext } from '~/context/IsLightModeContext';

export function ColorSchemeToggle(props: {hidden: boolean}) {
  const { setColorScheme } = useMantineColorScheme();
  const isLightMode = useContext(IsLightModeContext);

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