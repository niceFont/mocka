import {Link} from '@remix-run/react';
import {TiArrowRightThick} from 'react-icons/ti';
import {HiTrendingDown} from 'react-icons/hi';
import {AiFillSave} from 'react-icons/ai';

export default function Index() {
	return (
		<>
			<div className='background' />
			<div className='flex flex-col justify-center mt-56 items-center relative  text-slate-700 '>
				<div className='flex flex-col'>
					<h1 className='text-5xl underline underline-offset-4 font-bold'>
            Fast prototyping for developers
					</h1>
					<p
						style={{
							textShadow: `
   -1px -1px 0 #fff,  
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
     1px 1px 0 #fff`,
						}}
						className='mt-6 ml-2 max-w-[55ch] text-xl font-semibold'
					>
            Easily create free HTTP Endpoints in a matter of seconds
            and save precious time to validate your ideas.
					</p>

					<div className='mt-12 ml-2 flex'>
						<Link className='p-4 w-[200px] text-orange-500 bg-white border-4 border-orange-500 rounded-lg border-dotted transition duration-300 transform active:scale-95 ease-in-out  text-xl flex flex-row items-center justify-center font-semibold hover:scale-95  focus:outline-none' to='/new'>
              Get Started
							{' '}
							<TiArrowRightThick className='ml-2 text-2xl' />
						</Link>
					</div>
				</div>
			</div>
			<div className='text-lg flex justify-center w-full ' style={{marginTop: '300px'}}>
				<div className='mt-24 w-3/4 xl:w-1/2'>
					<div style={{width: 'fit-content'}} className='bg-white rounded-xl p-8 shadow-2xl '>
						<h3 className='text-3xl font-semibold text-slate-600 mb-3'>What is Mocka?</h3>
						<p style={{maxWidth: '55ch'}} className='text-gray-700'>
              Mocka helps you prototype faster than usual.

              Instead of wasting time, creating a HTTP Server to serve dummy content
              you can just spin-up an Endpoint in a couple clicks to do it for you.
						</p>
					</div>
					<div className='mt-24 w-full flex items-end flex-col'>
						<div className='bg-white rounded-xl shadow-2xl p-8'>
							<h3 className='text-3xl flex flex-row items-center font-semibold text-slate-600 mb-3'>
								<AiFillSave className='mr-2' />
                Caching
							</h3>
							<p style={{maxWidth: '55ch'}} className='text-gray-700'>
                Mocka caches your API Endpoints for a long long time.
                This ensures that your responses will be fast and predictable,
                saving precious time that would be otherwise wasted.
							</p>
						</div>
					</div>
					<div className='mt-24'>
						<div className='bg-white rounded-xl shadow-2xl p-8' style={{width: 'fit-content'}}>
							<h3 className='text-3xl flex flex-row items-center font-semibold text-slate-600 mb-3'>
								<HiTrendingDown className='mr-2' />
                Low Latency
							</h3>
							<p style={{maxWidth: '55ch'}} className='text-gray-700'>
                Additionally, your Endpoints are executed on the Edge using Cloudflare Workers.
                Providing you with low latency wherever you may be.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
