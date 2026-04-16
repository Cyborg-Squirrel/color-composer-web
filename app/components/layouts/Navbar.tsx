import { AppShell, NavLink } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router';
import classes from './Navbar.module.css';

const navItems = [
  { key: 'nav-0', link: '/', label: 'Home', emoji: '🏠' },
  { key: 'nav-1', link: '/clients', label: 'Clients', emoji: '🛜' },
  { key: 'nav-2', link: '/strips', label: 'LED Strips', emoji: '💡' },
  { key: 'nav-3', link: '/effects', label: 'Effects', emoji: '✨' },
  { key: 'nav-4', link: '/palettes', label: 'Palettes', emoji: '🎨' },
  { key: 'nav-5', link: '/triggers', label: 'Triggers', emoji: '⏲️' },
  { key: 'nav-6', link: '/settings', label: 'Settings', emoji: '⚙️' },
  { key: 'nav-7', link: '/about', label: 'About', emoji: 'ℹ' }
];

const bottomNavItems: any[] = [];

const allNavItems = [...navItems, ...bottomNavItems];

function Navbar({ selectedNavItemText }: { selectedNavItemText: string }) {
  const selectedNavItem = selectedNavItemText?.trim()
    ? allNavItems.find(item => item.link.toLowerCase() === selectedNavItemText.trim().toLowerCase() ||
      item.label.toLowerCase() === selectedNavItemText.trim().toLowerCase())?.label
    : '';

  const [active, setActive] = useState(selectedNavItem);

  const navComponents = navItems.map((item) => (
    <NavLink
      id={item.key}
      key={item.key}
      component={Link}
      to={item.link}
      label={item.label}
      leftSection={<span className={item.label === active ? classes.linkIcon : classes.grayscale}>{item.emoji}</span>}
      active={item.label === active}
    />
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavLink
      id={item.key}
      key={item.key}
      component={Link}
      to={item.link}
      label={item.label}
      leftSection={<span className={item.label === active ? classes.linkIcon : classes.greyScaleIcon}>{item.emoji}</span>}
      active={item.label === active}
    />
  ));

  return <AppShell.Navbar className={classes.navbar}>
    {navComponents}
    <div className={bottomNavComponents.length == 0 ? "" : classes.footer}>
      {bottomNavComponents}
    </div>
  </AppShell.Navbar>
}

export default Navbar;

