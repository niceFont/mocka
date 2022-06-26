import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react';
import type {MetaFunction} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import Layout from './components/Layout';
import styles from './styles/app.css';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ENV: {
			API_HOST: string
		}
  }
}

export const meta: MetaFunction = () => ({
	title: 'Mock - Prototyping fast and easy',
	charset: 'utf-8',
	viewport: 'width=device-width,initial-scale=1',
});
export function links() {
	return [{rel: 'stylesheet', href: styles}];
}

export async function loader() {
	return json({
		ENV: {
			API_HOST: process.env.API_HOST,
		},
	});
}

export default function App() {
	const data = useLoaderData();
	return (
		<html lang='en'>
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Layout>
					<Outlet />
					<script dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}></script>
				</Layout>
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	);
}
