import {PropsWithChildren} from 'react';
import {Link} from '@remix-run/react';
import Footer from '~/components/Footer';

function Navbar({children}: PropsWithChildren<any>) {
	return (
		<>
			<header className='flex justify-center'>
				<nav className='flex justify-between md:w-full  lg:max-w-[1400px] p-4'>
					<Link to='/'>
						<h1 className='font-bold text-4xl tracking-tighter text-slate-800 '>Mocka.</h1>
					</Link>
				</nav>
			</header>
			<main className='flex justify-center'>
				<div className='w-full'>
					{children}
				</div>
			</main>
			<Footer />
		</>
	);
}

export default Navbar;
