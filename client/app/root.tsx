import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { MetaFunction } from '@remix-run/server-runtime';
import Layout from './components/Layout';
import styles from './styles/app.css';

export const meta: MetaFunction = () => ({ 
  title: 'Mock - Prototyping fast and easy',
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1"
});
export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
