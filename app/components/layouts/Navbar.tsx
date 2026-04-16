import { AppShell, NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router';
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

function Navbar() {
  const { pathname } = useLocation();

  const navComponents = navItems.map((item) => (
    <NavLink
      id={item.key}
      key={item.key}
      component={Link}
      to={item.link}
      label={item.label}
      leftSection={<span className={pathname === item.link ? classes.linkIcon : classes.grayscale}>{item.emoji}</span>}
      active={pathname === item.link}
    />
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavLink
      id={item.key}
      key={item.key}
      component={Link}
      to={item.link}
      label={item.label}
      leftSection={<span className={pathname === item.link ? classes.linkIcon : classes.greyScaleIcon}>{item.emoji}</span>}
      active={pathname === item.link}
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

