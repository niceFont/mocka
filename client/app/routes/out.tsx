import {useEffect, useRef, useState} from 'react';
import {useLoaderData, useLocation} from '@remix-run/react';
import socketIOClient from 'socket.io-client';
import Container from '~/components/Container';
import Table from '~/components/Table';
import {EndpointRequest} from '~/types';
import {json} from '@remix-run/server-runtime';
import {endpointRepository} from '~/models/index.server';

export async function action({request} : {request: Request}) {
	try {
		const url = new URL(request.url);
		const hash = url.searchParams.get('r');
		if (!hash) {
			return;
		}

		const endpoint = await endpointRepository.getEndpoint(hash);

		return json(endpoint);
	} catch (error) {
		console.log(error);
	}
}

function Out() {
	const endpoint = useLoaderData();
	const location = useLocation();
	const [url, setUrl] = useState<string>('');
	const [endpointRequests, setEndpointRequests] = useState<Array<EndpointRequest>>([]);
	const urlRef = useRef<HTMLInputElement>(null);
	const addToClipboard = () => {
		const content = urlRef.current;
		content?.select();
		document.execCommand('copy');
	};

	const params = new URLSearchParams(location.search);

	useEffect(() => {
		const socket = socketIOClient(window.ENV.API_HOST, {
			path: '/ws',
		});
		socket.on('connect', () => {
			socket.emit('register', params.get('r') ?? '');
		});
		socket.on('got_request', data => {
			setEndpointRequests(reqs => [...reqs, data]);
		});
		return () => {
			socket.close();
		};
	}, []);

	useEffect(() => {
		const apiUrl = `${window.ENV.API_HOST}/${params.get('r') ?? ''}`;
		setUrl(apiUrl);
	}, [location.search]);
	return (
		<div className='flex justify-center'>
			<Container className='mt-28'>
				<div className='flex justify-center'>
					<h2 className='text-3xl font-bold'>Try It!</h2>
				</div>
				<div className='flex flex-row mt-6 justify-center'>
					<input readOnly value={url} ref={urlRef} className='border bg-white border-b-4 shadow-md font-medium rounded-sm py-3 px-6 flex items-center outline-none focus:ring-2 focus:ring-blue-500' />
					<button onClick={addToClipboard} className='py-3 px-6 border-b-4 rounded-sm border-slate-700 bg-slate-600 text-white font-semibold text-lg shadow-md ' type='button'>Copy!</button>
				</div>
				<div className='flex flex-col mt-12 p-4 w-full bg-white'>
					<div className='flex items-center justify-between'>
						<h2 className='text-3xl font-bold text-slate-500 underline-offset-2 underline'>Incoming Requests:</h2>
						<button onClick={() => setEndpointRequests([])}>Reset</button>
					</div>
					<div>
						<Table items={endpointRequests}/>
					</div>
				</div>
			</Container>
		</div>
	);
}

export default Out;
