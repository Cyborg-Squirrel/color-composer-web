import { Code, Group, Text } from '@mantine/core';
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
    <NavItem key={item.key} data={item} active={active} setActive={setActive}/>
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavItem key={item.key} data={item} active={active} setActive={setActive}/>
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

// @ts-ignore
function NavItem(props) {
  let active = props.data.label === props.active || undefined;
  return (
    <a
      className={classes.link}
      data-active={active}
      href={props.data.link}
      key={props.data.label}
      onClick={() => {
        props.setActive(props.data.label);
      }}
    >
      <span className={active ? classes.linkIcon : classes.greyScaleIcon}>{props.data.emoji}</span>
      <span>&nbsp;{props.data.label}</span>
    </a>
  );
}
