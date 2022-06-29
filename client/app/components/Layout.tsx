import {PropsWithChildren} from 'react';
import {Link, useLocation} from '@remix-run/react';
import Footer from '~/components/Footer';
import clsx from 'clsx';

function Navbar({children}: PropsWithChildren<unknown>) {
	const location = useLocation();
	const isHomePage = location.pathname === '/';
	return (
		<div className='flex h-screen flex-col'>
			<header className='flex justify-center'>
				<nav className='flex justify-between md:w-full  lg:max-w-[1400px] p-4'>
					<Link to='/'>
						<h1 className={clsx('font-bold text-4xl tracking-tighter', isHomePage ? 'text-slate-800' : 'text-white')}>Mocka<span className='text-orange-400'>.</span></h1>
					</Link>
				</nav>
			</header>
			<main className='flex grow justify-center'>
				<div className='w-full'>
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Navbar;
