import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration
} from "react-router";

import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  type CSSVariablesResolver,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { StrictMode } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import ApiProvider from "./provider/ApiContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
  },
];

// Neon design uses DM Sans for body, JetBrains Mono for data/labels.
// Primary color defaults to Mantine 'blue' (matches the design's light-mode
// accent). Dark mode swaps the filled-primary token to the design's green
// via the css variables resolver below.
const theme = createTheme({
  fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  headings: { fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif' },
  primaryColor: 'blue',
  defaultRadius: 'sm',
});

const resolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': 'var(--neon-bg)',
  },
  dark: {
    '--mantine-color-body': 'var(--neon-bg)',
    // Map Mantine's primary tokens to the design's dark-mode green accent.
    '--mantine-primary-color-filled': 'var(--neon-accent)',
    '--mantine-primary-color-filled-hover': 'var(--neon-accent)',
    '--mantine-primary-color-light': 'var(--neon-accent-dim)',
    '--mantine-primary-color-light-hover': 'var(--neon-accent-dim)',
    '--mantine-primary-color-light-color': 'var(--neon-accent)',
    '--mantine-primary-color-contrast': '#0d0f11',
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <MantineProvider defaultColorScheme="auto" theme={theme} cssVariablesResolver={resolver}>
        <ApiProvider>
          <html lang="en">
            <head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <Meta />
              <Links />
              <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
              {children}
              <ScrollRestoration />
              <Scripts />
            </body>
          </html>
        </ApiProvider>
      </MantineProvider>
    </StrictMode>
  );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
