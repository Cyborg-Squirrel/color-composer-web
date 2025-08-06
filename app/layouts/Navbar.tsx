import { Code, Group, Text } from '@mantine/core';
import { useState } from 'react';
import classes from './Navbar.module.css';

const data = [
  { link: '#', label: 'Clients'},
  { link: '#', label: 'LED Strips'},
  { link: '#', label: 'Effects'},
  { link: '#', label: 'Palettes'},
  { link: '#', label: 'Triggers'}
];

// @ts-ignore
export function Navbar({navbarTitle, selectedNavbarItem}) {
  const [active, setActive] = useState(selectedNavbarItem);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text className={classes.span} fw={700} span>{navbarTitle}</Text>
          <Code fw={700}>v0.0.1</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <span>Settings</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <span>About</span>
        </a>
      </div>
    </nav>
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
