
import { useActionData } from "remix";
import { md5 } from "hash-wasm"
import { object, number, string, validate, optional, defaulted, size } from "superstruct"
import { TiDeleteOutline, TiPlus } from "react-icons/ti"
import { useState, MouseEvent } from "react";
import { getHeaders } from "~/utils/form";

const Endpoint = object({
  status: size(number(), 100, 599),
  method: string(),
  headers: defaulted(optional(string()), () => null),
  body: defaulted(optional(string()), () => null),
  contentType: defaulted(string(), () => "application/json"),
})
export async function action({ request }: { request: Request }) {
  const form = await request.formData()

  const headers = await getHeaders(form)

  const body = {
    headers,
    status: form.get("status"),
    method: form.get("method"),
    body: form.get("body"),
    contentType: form.get("contentType"),
  }

  console.log(body)
  const [error, endpoint] = validate(body, Endpoint, { coerce: true })
  if (error) {
    const { key, value, type } = error
    let err: Error;
    if (typeof value === "undefined") {
      err = new Error(`${key} is required`)
    } else if (type === "never") {
      err = new Error(`attribute is unknown`)
    } else {
      err = new Error(`${key} is invalid`)
    }
    return new Response(err.message, { status: 400 })
  }


  const hash = await md5(JSON.stringify(endpoint))
  // @ts-ignore
  await MOCKA_STORE.put(hash, JSON.stringify(endpoint))
  return new Response(hash, { status: 200 })
}
export default function Index() {
  const data = useActionData()
  console.log(data)
  const [headers, setHeaders] = useState<Array<string>>(["adwadwdaf"])

  const handleAddHeader = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setHeaders((prev: Array<string>) => ([...prev, "wow"]))
  }

  const handleDeleteHeader = (e: MouseEvent<HTMLButtonElement>, key: string) => {
    e.preventDefault()
    setHeaders((prev: Array<string>) => prev.filter(h => h !== key))
  }

  return (
    <div>
      <form method="POST">
        <h1 className="font-bold text-3xl mb-10 text-slate-600">Create your Endpoint</h1>
        <div className="flex flex-row">
          <div className="flex flex-col mr-10">
            <label className="font-semibold text-gray-600" htmlFor="status">Status:</label>
            <input placeholder="200" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-blue-400" type="number" min={100} max={599} name="status" />
          </div>
          <div className="flex flex-col mr-10">
            <label className="text-gray-600 font-semibold" htmlFor="contentType">Content-Type:</label>
            <input placeholder="text/plain" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" list="contentTypes" type="text" autoComplete="on" name="contentType" />
            <datalist id="contentTypes">
              <option value="application/json" />
              <option value="text/plain"></option>
            </datalist>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-600" htmlFor="method">Method:</label>
            <select className="rounded-sm mt-2 px-2 py-3 text-center text-black border border-gray-300 placeholder-gray-600 w-full  text-base   transition duration-500 ease-in-out transform bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" placeholder="GET" name="method">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Headers</span>
            <button onClick={handleAddHeader} className="flex items-center hover:bg-gray-100 hover:text-gray-700 rounded-md px-2  transition duration-300 transform active:scale-95 ease-in-out"><TiPlus /> Add Header</button>
          </div>
          {headers.map((key, index) => (
            <div key={index} className="mt-2 flex flex-row justify-center align-middle items-center">
              <input placeholder="Key" className="mr-2 text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[key]`} />
              <input placeholder="Value" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[value]`} />
              <button onClick={(e: MouseEvent<HTMLButtonElement>) => handleDeleteHeader(e, key)} className="ml-4 text-3xl text-red-400"><TiDeleteOutline /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-col mt-5">
          <label className="text-gray-600 font-semibold" htmlFor="body">Body:</label>
          <textarea className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400 resize-none " name="body"></textarea>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-blue-800 rounded-md hover:bg-blue-600  focus:outline-none focus:bg-blue-500  transition duration-300 transform active:scale-95 ease-in-out" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
