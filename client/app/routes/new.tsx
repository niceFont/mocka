import {
  validationError, ValidatedForm, useFormContext, useField,
} from 'remix-validated-form';
import { withYup } from '@remix-validated-form/with-yup';
import { hash as md5 } from 'spark-md5';
import { TiDeleteOutline, TiPlus } from 'react-icons/ti';
import { useState, MouseEvent, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { EndpointSchema } from '~/schemas';
import { formatHeaders } from '~/utils';

const validator = withYup(EndpointSchema);

export async function action({ request }: { request: Request }) {
  try {
    const fieldValues = await validator.validate(await request.formData());
    if (fieldValues.error) return validationError(fieldValues.error);

    const headersObj = formatHeaders(fieldValues.data.headers);
    const payload = {
      ...fieldValues.data,
      headers: headersObj,
    };
    const hash = md5(JSON.stringify(payload));
    // @ts-ignore
    // eslint-disable-next-line no-undef
    await MOCKA_STORE.put(hash, JSON.stringify(payload));
    return new Response(hash, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

export function headers() {
  return { 'Cache-Control': 'max-age=604800, s-maxage=604800' };
}

function Input({
  children, name, className, ...props
}: PropsWithChildren<any>) {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <input className={clsx(className, error ? 'border-red-500' : 'border-gray-300')} {...getInputProps({ ...props })} name={name} />
      {error && <span className="text-red-500 text-sm italic">{error}</span>}
    </>
  );
}
function Textarea({ children, name, ...props }: PropsWithChildren<any>) {
  const { error, getInputProps } = useField(name);
  return (
    <>
      {error && <span className="text-red-500 font-thin italic">{error}</span>}
      <textarea {...getInputProps({ ...props })} name={name} />
    </>
  );
}

function Submit() {
  const { isSubmitting } = useFormContext();
  return (
    <button className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-blue-800 rounded-md hover:bg-blue-600  focus:outline-none focus:bg-blue-500  transition duration-300 transform active:scale-95 ease-in-out" type="submit">{isSubmitting ? 'Saving...' : 'Save'}</button>
  );
}

let counter = 0;
const idPrefix = 'header';
export default function Index() {
  const [headerList, setHeaders] = useState<Array<string>>([]);

  const handleAddHeader = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    counter += 1;
    setHeaders((prev: Array<string>) => ([...prev, `${idPrefix}-${counter}`]));
  };

  const handleDeleteHeader = (e: MouseEvent<HTMLButtonElement>, key: string) => {
    e.preventDefault();
    setHeaders((prev: Array<string>) => prev.filter((h) => h !== key));
  };

  return (
    <div>
      <ValidatedForm noValidate id="new-endpoint-form" validator={validator} method="post">
        <fieldset>
          <h1 className="font-bold text-3xl mb-10 text-slate-600">Create your Endpoint</h1>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col mr-10">
              <label className="font-semibold text-gray-600" htmlFor="status">Status:</label>
              <Input id="status" placeholder="200" className="text-black text-center border max-w-[90px] min-w-[90px] border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-blue-400" type="number" min={100} max={599} name="status" />
            </div>
            <div className="flex flex-col mr-10">
              <label className="font-semibold text-gray-600" htmlFor="method">Method:</label>
              <select className="rounded-sm min-w-[100px] mt-2 px-2 py-3 text-center text-black border border-gray-300 placeholder-gray-600 w-full  text-base   transition duration-500 ease-in-out transform bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" placeholder="GET" name="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div className="w-full flex flex-col">
              <label className="text-gray-600 font-semibold" htmlFor="contentType">Content-Type:</label>
              <Input id="contentType" placeholder="text/plain" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" list="contentTypes" type="text" autoComplete="on" name="contentType" />
              <datalist id="contentTypes">
                <option aria-label="application/json" value="application/json" />
                <option aria-label="text/plain" value="text/plain" />
              </datalist>
            </div>
          </div>
          <div className="flex flex-col mt-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Headers</span>
              <button type="button" onClick={handleAddHeader} className="flex items-center hover:bg-gray-100 hover:text-gray-700 rounded-md px-2  transition duration-300 transform active:scale-95 ease-in-out">
                <TiPlus />
                {' '}
                Add Header
              </button>
            </div>
            {headerList.map((key, index) => (
              <div key={key} className="mt-2 flex flex-row ">
                <div className="mr-2 flex flex-col w-full">
                  <Input placeholder="Key" className=" text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[${index}].key`} />
                </div>
                <div className="flex flex-col w-full">
                  <Input placeholder="Value" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[${index}].value`} />
                </div>
                <button aria-label="Save" type="button" onClick={(e: MouseEvent<HTMLButtonElement>) => handleDeleteHeader(e, key)} className="ml-3 text-3xl flex mt-2 text-red-400"><TiDeleteOutline /></button>
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-5">
            <label className="text-gray-600 font-semibold" htmlFor="body">Body:</label>
            <Textarea className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400 resize-none " name="body" />
          </div>
          <div className="mt-5 flex justify-end">
            <Submit />
          </div>
        </fieldset>
      </ValidatedForm>
    </div>
  );
}
