import { Code, Group, NavLink, Text } from '@mantine/core';
import { useState } from 'react';
import classes from './Navbar.module.css';

const navItems = [
  { key: 'nav-0', link: '/', label: 'Home', emoji: '🏠' },
  { key: 'nav-1', link: 'clients', label: 'Clients', emoji: '🛜' },
  { key: 'nav-2', link: 'strips', label: 'LED Strips', emoji: '💡' },
  { key: 'nav-3', link: 'effects', label: 'Effects', emoji: '✨' },
  { key: 'nav-4', link: 'palettes', label: 'Palettes', emoji: '🎨' },
  { key: 'nav-5', link: 'triggers', label: 'Triggers', emoji: '⏲️' }
];

const bottomNavItems = [
  { key: 'nav-6', link: 'settings', label: 'Settings', emoji: '⚙️' },
  { key: 'nav-7', link: 'about', label: 'About', emoji: 'ℹ' }
];

const allNavItems = [...navItems, ...bottomNavItems];

interface NavBarProps {
  title: string;
  selectedNavItemText: string;
}

export function Navbar({title, selectedNavItemText}: NavBarProps) {
  const selectedNavItem = selectedNavItemText?.trim()
  ? allNavItems.find(item => item.link.toLowerCase() === selectedNavItemText.trim().toLowerCase())?.label
  : '';
  
  const [active, setActive] = useState(selectedNavItem);

  const navComponents = navItems.map((item) => (
    <NavLink
        key={item.key}
        href={item.link}
        label={item.label}
        leftSection={<span className={item.label === active ? classes.linkIcon : classes.greyScaleIcon}>{item.emoji}</span>}
        active={ item.label === active }
    />
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavLink
        key={item.key}
        href={item.link}
        label={item.label}
        leftSection={<span className={item.label === active ? classes.linkIcon : classes.greyScaleIcon}>{item.emoji}</span>}
        active={ item.label === active }
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <Group className={classes.header} justify="space-between">
          <Text className={classes.span} fw={700} span>{title}</Text>
          <Code fw={700}>v0.0.1</Code>
        </Group>
        {navComponents}
      </div>

      <div className={bottomNavComponents.length == 0 ? "" : classes.footer}>
        {bottomNavComponents}
      </div>
    </nav>
  );
}

