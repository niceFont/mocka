import {
	validationError, ValidatedForm, useFormContext, useField,
} from 'remix-validated-form';
import {redirect} from '@remix-run/node';
import {withYup} from '@remix-validated-form/with-yup';
import {hash as md5} from 'spark-md5';
import {AiOutlinePlus} from 'react-icons/ai';
import {GoDiffRemoved} from 'react-icons/go';
import {useState, MouseEvent, PropsWithChildren, SetStateAction, Dispatch} from 'react';
import clsx from 'clsx';
import {EndpointSchema as endpointSchema} from '~/schemas';
import {extractBody, formatHeaders} from '~/utils';
import Container from '~/components/Container';
import {endpointRepository} from '~/models/index.server';
import {Prisma} from '@prisma/client';
import {Method} from '@prisma/client';

const validator = withYup(endpointSchema);

export async function action({request}: { request: Request }) {
	try {
		const fieldValues = await validator.validate(await request.formData());
		if (fieldValues.error) {
			return validationError(fieldValues.error);
		}

		const headers = formatHeaders(fieldValues.data.headers);
		const {body_plain, body_json} = extractBody(fieldValues.data);
		const payload: Omit<Prisma.EndpointCreateInput, 'slug'> = {
			body_json,
			body_plain,
			headers: headers as Prisma.InputJsonObject,
			method: fieldValues.data.method as Method,
			content_type: fieldValues.data.contentType,
			status: fieldValues.data.status,
		};
		const hash = md5(JSON.stringify(payload));
		try {
			await endpointRepository.createEndpoint({
				...payload,
				slug: hash,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					// We recover here by just redirecting to the already existing endpoint
					return redirect(`/out?r=${hash}`, 308);
				}
			}
		}

		return redirect(`/out?r=${hash}`, 308);
	} catch (error) {
		return new Response((error as Error).message, {status: 500});
	}
}

export function headers() {
	return {'Cache-Control': 'max-age=604800, s-maxage=604800'};
}

function Input({
	children, name, className, ...props
}: PropsWithChildren<any>) {
	const {error, getInputProps} = useField(name);
	return (
		<>
			<input
				className={clsx('form-input appearance-none transition duration-500 ease-in-out transform rounded-md leading-tight bg-gray-100 text-gray-700 focus:outline-none focus:bg-white', className, error ? 'border-red-500' : 'border-gray-200')} {...getInputProps({...props})}
				name={name}/>
			{error && <span className='text-red-500 text-sm italic'>{error}</span>}
		</>
	);
}

function Textarea({children, name, className, ...props}: PropsWithChildren<any>) {
	const {error, getInputProps} = useField(name, {
		validationBehavior: {
			initial: 'onBlur',
			whenSubmitted: 'onBlur',
			whenTouched: 'onBlur',
		},
	});
	return (
		<>
			{error && <span className='text-red-500 text-sm italic'>{error}</span>}
			<textarea className={clsx('form-textarea', className)} {...getInputProps({...props})} name={name}/>
		</>
	);
}

interface HeaderProps {
	headerKey: string
	index: number
	setHeaders: Dispatch<SetStateAction<string[]>>
}

function Header({index, headerKey, setHeaders} : HeaderProps) : PropsWithChildren<any> {
	const headerKeyName = `headers[${index}].key`;
	const headerValueName = `headers[${index}].value`;
	const {clearError: clearKeyError} = useField(headerKeyName);
	const {clearError: clearValueError} = useField(headerValueName);
	const handleDeleteHeader = (e: MouseEvent<HTMLButtonElement>, key: string) => {
		e.preventDefault();
		clearValueError();
		clearKeyError();
		setHeaders((prev: string[]) => prev.filter(h => h !== key));
	};

	return (
		<div className='mt-2 flex flex-row '>
			<div className='mr-2 flex flex-col w-full'>
				<Input placeholder='Key'
					className='w-full px-4 py-2.5'
					type='text' name={headerKeyName}/>
			</div>
			<div className='flex flex-col w-full'>
				<Input placeholder='Value'
					className='w-full px-4 py-2.5'
					type='text' name={headerValueName}/>
			</div>
			<button aria-label='Save' type='button'
				onClick={(e: MouseEvent<HTMLButtonElement>) => {
					handleDeleteHeader(e, headerKey);
				}}
				className='ml-3 text-xl flex mt-3 text-red-400'><GoDiffRemoved/></button>
		</div>
	);
}

function Submit() {
	const {isSubmitting} = useFormContext();
	return (
		<button
			className='flex items-center px-5 py-2.5 font-medium tracking-wide text-blue-600 capitalize bg-white rounded-md hover:text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-500  transition duration-300 transform active:scale-95 ease-in-out'
			type='submit'>{isSubmitting ? 'Saving...' : 'Save'}</button>
	);
}

export default function Index() {
	const [headerList, setHeaders] = useState<Array<string>>([]);
	const [counter, setCounter] = useState(0);
	const idPrefix = 'header';

	const handleAddHeader = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setCounter(counter + 1);
		setHeaders((prev: Array<string>) => ([...prev, `${idPrefix}-${counter}`]));
	};

	return (
		<div className='flex justify-center'>
			<Container className='mt-32'>
				{/* @ts-ignore Type is inferred from validation schema */}
				<ValidatedForm noValidate defaultValues={{status: 200}} id='new-endpoint-form' validator={validator} method='post'>
					<fieldset>
						<h1 className='font-bold text-2xl sm:text-3xl mb-10 text-slate-500'>
                            Create your Endpoint
							<span className='text-orange-400 text-5xl h-2'>.</span>
						</h1>
						<div className='flex flex-col md:justify-between md:flex-row'>
							<div className='flex flex-row justify-between  sm:justify-start  md:justify-between mb-4 md:mb-1'>

								<div className='flex flex-col sm:mr-10 max-w-[90px]'>
									<label className='font-semibold text-gray-600' htmlFor='status'>Status:</label>
									<Input id='status' placeholder='200'
										className='form-input text-center max-w-[90px] min-w-[90px] w-full px-4 py-2.5 mt-2'
										type='number' min={200} max={599} name='status'/>
								</div>
								<div className='flex flex-col sm:mr-10'>
									<label className='font-semibold text-gray-600' htmlFor='method'>Method:</label>
									<select
										className=' text-center border-gray-200 bg-no-repeat cursor-pointer appearance-none form-select min-w-[100px] mt-2 px-2 py-2.5 text-center w-full transition duration-500 ease-in-out transform rounded leading-tight bg-gray-100 text-gray-700 focus:outline-none focus:bg-white'
										placeholder='GET' name='method'>
										<option value='GET'>GET</option>
										<option value='POST'>POST</option>
										<option value='PUT'>PUT</option>
										<option value='DELETE'>DELETE</option>
										<option value='PATCH'>PATCH</option>
									</select>
								</div>
							</div>
							<div className='w-full flex flex-col'>
								<label className='text-gray-600 font-semibold'
									htmlFor='contentType'>Content-Type:</label>
								<Input id='contentType' placeholder='text/plain'
									className='w-full px-4 py-2.5 mt-2 text-base'
									list='contentTypes' type='text' autoComplete='on' name='contentType'/>
								<datalist id='contentTypes'>
									<option aria-label='application/json' value='application/json'/>
									<option aria-label='text/plain' value='text/plain'/>
								</datalist>
							</div>
						</div>
						<div className='flex flex-col mt-5'>
							<div className='flex justify-between items-center'>
								<span className='font-semibold text-gray-600'>Headers</span>
								<button type='button' onClick={handleAddHeader}
									className='flex items-center  rounded-md px-2  transition duration-300 transform active:scale-95 ease-in-out'>
									<AiOutlinePlus className='mr-2'/>
                                    Add Header
								</button>
							</div>
							{headerList.map((key, index) => (
								<Header key={key} headerKey={key} index={index} setHeaders={setHeaders}/>
							))}
						</div>
						<div className='flex flex-col mt-5'>
							<label className='text-gray-600 font-semibold' htmlFor='body'>Body:</label>
							<Textarea
								className='text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400 resize-none '
								name='body'/>
						</div>
						<div className='mt-5 flex justify-end'>
							<Submit/>
						</div>
					</fieldset>
				</ValidatedForm>
			</Container>
		</div>
	);
}
