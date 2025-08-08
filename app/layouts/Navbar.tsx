import { Code, Group, Text } from '@mantine/core';
import { useState } from 'react';
import classes from './Navbar.module.css';

const navItems = [
  { key: 'nav-0', link: '#', label: 'Clients', emoji: '🛜' },
  { key: 'nav-1', link: '#', label: 'LED Strips', emoji: '💡' },
  { key: 'nav-2', link: '#', label: 'Effects', emoji: '✨' },
  { key: 'nav-3', link: '#', label: 'Palettes', emoji: '🎨' },
  { key: 'nav-4', link: '#', label: 'Triggers', emoji: '⏲️' }
];

const bottomNavItems = [
  { key: 'nav-5', link: '#', label: 'Settings', emoji: '⚙️' },
  { key: 'nav-6', link: '#', label: 'About', emoji: 'ℹ' }
];

// @ts-ignore
export function Navbar({navbarTitle, selectedNavbarItem}) {
  const [active, setActive] = useState(selectedNavbarItem);

  const navComponents = navItems.map((item) => (
    <NavItem key={item.key} data={item} active={active} setActive={setActive}/>
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavItem key={item.key} data={item} active={active} setActive={setActive}/>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text className={classes.span} fw={700} span>{navbarTitle}</Text>
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
