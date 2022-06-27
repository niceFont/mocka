import {PropsWithChildren} from 'react';
import {Link} from '@remix-run/react';
import Footer from '~/components/Footer';

function Navbar({children}: PropsWithChildren<any>) {
	return (
		<div className='flex h-screen flex-col'>
			<header className='flex justify-center'>
				<nav className='flex justify-between md:w-full  lg:max-w-[1400px] p-4'>
					<Link to='/'>
						<h1 className='font-bold text-4xl tracking-tighter text-slate-800 '>Mocka.</h1>
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
