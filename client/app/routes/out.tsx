import {useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';

function Out() {
	const location = useLocation();
	const [url, setUrl] = useState<string>('');

	const urlRef = useRef<HTMLInputElement>(null);
	const addToClipboard = () => {
		const content = urlRef.current;
		content?.select();
		document.execCommand('copy');
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const apiUrl = `${window.ENV.API_HOST}/${params.get('r') ?? ''}`;
		setUrl(apiUrl);
	}, [location.search]);
	return (
		<div className='flex flex-row justify-center'>
			<input readOnly value={url} ref={urlRef} className='border bg-white border-b-4 shadow-md font-medium rounded-sm py-3 px-6 flex items-center outline-none focus:ring-2 focus:ring-blue-500' />
			<button onClick={addToClipboard} className='py-3 px-6 border-b-4 rounded-sm border-slate-700 bg-slate-600 text-white font-semibold text-lg shadow-md ' type='button'>Copy!</button>
		</div>
	);
}

export default Out;
