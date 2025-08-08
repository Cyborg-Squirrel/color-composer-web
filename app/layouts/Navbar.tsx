import { Code, Group, Text } from '@mantine/core';
import { useState } from 'react';
import classes from './Navbar.module.css';

const navItems = [
  { key: 'nav-0', link: '#', label: 'Clients' },
  { key: 'nav-1', link: '#', label: 'LED Strips' },
  { key: 'nav-2', link: '#', label: 'Effects' },
  { key: 'nav-3', link: '#', label: 'Palettes' },
  { key: 'nav-4', link: '#', label: 'Triggers' }
];

const bottomNavItems = [
  { key: 'nav-5', link: '#', label: 'Settings' },
  { key: 'nav-6', link: '#', label: 'About' }
];

// @ts-ignore
export function Navbar({navbarTitle, selectedNavbarItem}) {
  const [active, setActive] = useState(selectedNavbarItem);

  const navComponents = navItems.map((item) => (
    <NavItem key={item.key} label={item.label} link={item.link} active={active} setActive={setActive}/>
  ));

  const bottomNavComponents = bottomNavItems.map((item) => (
    <NavItem key={item.key} label={item.label} link={item.link} active={active} setActive={setActive}/>
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

      <div className={classes.footer}>
        {bottomNavComponents}
      </div>
    </nav>
  );
}

function NavItem(props) {
  return (
    <a
      className={classes.link}
      data-active={props.label === props.active || undefined}
      href={props.link}
      key={props.label}
      onClick={(event) => {
        event.preventDefault();
        props.setActive(props.label);
      }}
    >
      <span>{props.label}</span>
    </a>
  );
}

const OLDSidebarLayout = ({sidebarTitle, selectedSidebarItem}) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">{sidebarTitle}</h2>
        <nav className="space-y-4">
          <NavLink
          label="Home"
          href="#"
          active={selectedSidebarItem === 'Clients'}
          // onClick={() => setActive('home')}
        />
          <a href="#" className="block">🛜 Clients</a>
          <a href="#" className="block">💡 LED Strips</a>
          <a href="#" className="block">✨ Effects</a>
          <a href="#" className="block">🎨 Palettes</a>
          <a href="#" className="block">⏲️ Triggers</a>
          <a href="#" className="block">⚙️ Settings</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{selectedSidebarItem}</h1>
        <p className="text-gray-600">
          TODO user interface
        </p>
      </main>
    </div>
  );
};

export default OLDSidebarLayout;
