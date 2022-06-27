import {Link} from '@remix-run/react';

function Footer() {
	return (
		<div className='flex flex-row w-full justify-center mt-12 border-black border-t-2  bg-white p-4'>
			<Link className='mr-10 text-orange-500 underline underline-offset-2' to='/impressum'>Impressum</Link>
			<Link className='mr-10 text-orange-500 underline underline-offset-2' to='tos'>Terms of Service</Link>
			<Link className='mr-10 text-orange-500 underline underline-offset-2' to='privacy'>Privacy Policy</Link>
		</div>
	);
}

export default Footer;
