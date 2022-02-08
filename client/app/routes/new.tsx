
import { useActionData, useTransition, json, Form } from "remix";
import { validationError, ValidatedForm, useFormContext, useIsSubmitting, useIsValid, useField } from "remix-validated-form"
import { withYup } from "@remix-validated-form/with-yup"
import { md5 } from "hash-wasm"
import { TiDeleteOutline, TiPlus } from "react-icons/ti"
import { useState, MouseEvent, useEffect } from "react";
import { EndpointSchema } from "~/schemas";

const validator = withYup(EndpointSchema)


export async function action({ request }: { request: Request }) {
  const fieldValues = await validator.validate(await request.formData())
  if (fieldValues.error) return validationError(fieldValues.error)

  console.log(fieldValues)
  const hash = await md5(JSON.stringify(fieldValues))
  // @ts-ignore
  await MOCKA_STORE.put(hash, JSON.stringify(fieldValues.data))
  return new Response(hash, { status: 200 })
}

function Input({ children, name, errorOrientation = "bottom", ...props }: any) {
  const { error, getInputProps, touched } = useField(name)
  console.log(error, touched, name)
  return (
    <div>
      {error && errorOrientation === "top" && <span className="text-red-500 text-sm italic">{error}</span>}
      <input {...getInputProps({ ...props })} name={name} />
      {error && errorOrientation === "bottom" && <span className="text-red-500 text-sm italic">{error}</span>}
    </div>
  )
}
function Textarea({ children, name, ...props }: any) {
  const { error, getInputProps } = useField(name)
  return (
    <>
      {error && <span className="text-red-500 font-thin italic">{error}</span>}
      <textarea {...getInputProps({ ...props })} name={name} ></textarea>
    </>
  )
}

function Submit() {
  const { isSubmitting, fieldErrors } = useFormContext()
  console.log(fieldErrors)
  return (
    <button className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-blue-800 rounded-md hover:bg-blue-600  focus:outline-none focus:bg-blue-500  transition duration-300 transform active:scale-95 ease-in-out" type="submit">{isSubmitting ? "Saving..." : "Save"}</button>
  )
}
export default function Index() {
  const data = useActionData()
  const isValid = useIsValid("new-endpoint-form")
  console.log(isValid)
  const [headers, setHeaders] = useState<Array<string>>([])

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
      <ValidatedForm noValidate id="new-endpoint-form" validator={validator} method="post">
        <fieldset >
          <h1 className="font-bold text-3xl mb-10 text-slate-600">Create your Endpoint</h1>
          <div className="flex flex-row">
            <div className="flex flex-col mr-10">
              <label className="font-semibold text-gray-600" htmlFor="status">Status:</label>
              <Input placeholder="200" className="text-black border max-w-1 border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-blue-400" type="number" min={100} max={599} name="status" />
            </div>
            <div className="flex flex-col mr-10">
              <label className="text-gray-600 font-semibold" htmlFor="contentType">Content-Type:</label>
              <Input placeholder="text/plain" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-md bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" list="contentTypes" type="text" autoComplete="on" name="contentType" />
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
                <Input placeholder="Key" className="mr-2 text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[${index}].key`} />
                <Input placeholder="Value" className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5  text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400" type="text" name={`headers[${index}].value`} />
                <button onClick={(e: MouseEvent<HTMLButtonElement>) => handleDeleteHeader(e, key)} className="ml-4 text-3xl text-red-400"><TiDeleteOutline /></button>
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-5">
            <label className="text-gray-600 font-semibold" htmlFor="body">Body:</label>
            <Textarea className="text-black border border-gray-300 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform  rounded-lg bg-gray-100  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:border-blue-400 resize-none " name="body"></Textarea>
          </div>
          <div className="mt-5 flex justify-end">
            <Submit />
          </div>
        </fieldset>
      </ValidatedForm>
    </div>
  );
}
