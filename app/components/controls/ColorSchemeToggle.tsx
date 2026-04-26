import { Switch, useMantineColorScheme } from '@mantine/core';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';

export function ColorSchemeToggle(props: { hidden: boolean }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (props.hidden) return null;

  return (
    <Switch
      size="md"
      checked={isDark}
      color="dark.4"
      onChange={() => setColorScheme(isDark ? 'light' : 'dark')}
      onLabel={<SunIcon size={14} color="var(--mantine-color-yellow-4)" />}
      offLabel={<MoonIcon size={14} color="var(--mantine-color-blue-5)" />}
      aria-label="Toggle color scheme"
    />
  );
}
