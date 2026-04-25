import { AppShell, NavLink } from '@mantine/core';
import { HouseIcon, LightbulbIcon, PaletteIcon, SparkleIcon, TimerIcon, WifiHighIcon } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router';
import classes from './Navbar.module.css';

const navItems = [
  { key: 'nav-0', link: '/',         label: 'Home',       icon: <HouseIcon size={18} /> },
  { key: 'nav-1', link: '/clients',  label: 'Clients',    icon: <WifiHighIcon size={18} /> },
  { key: 'nav-2', link: '/strips',   label: 'LED Strips', icon: <LightbulbIcon size={18} /> },
  { key: 'nav-3', link: '/effects',  label: 'Effects',    icon: <SparkleIcon size={18} /> },
  { key: 'nav-4', link: '/palettes', label: 'Palettes',   icon: <PaletteIcon size={18} /> },
  { key: 'nav-5', link: '/triggers', label: 'Triggers',   icon: <TimerIcon size={18} /> },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <AppShell.Navbar className={classes.navbar}>
      {navItems.map((item) => (
        <NavLink
          id={item.key}
          key={item.key}
          component={Link}
          to={item.link}
          label={item.label}
          leftSection={item.icon}
          active={pathname === item.link}
        />
      ))}
    </AppShell.Navbar>
  );
}

export default Navbar;
