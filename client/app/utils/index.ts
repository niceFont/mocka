import type {EndpointSchema} from "../schemas/index"
interface Header {
  key: string,
  value: string
}


interface FormatHeadersResult {
  [key : string]: string
}


export const formatHeaders = (
  headers: Array<Header>,
): FormatHeadersResult | undefined => {
  if (!headers) return undefined;
  return headers.reduce((acc, header) => {
    acc[header.key] = header.value;
    return acc;
  }, {} as FormatHeadersResult);
};

type Nullable<T> = T | null
interface ExtractBodyResponse {
  body_plain?: string
  body_json?: string
}


export const extractBody = (formData : EndpointSchema) : ExtractBodyResponse => {
  if(!formData.body) return {
  }
  switch(formData.contentType) {
    case "application/json":
      return {
        body_json: JSON.stringify(formData.body)
      }
    default:
      return {
        body_plain: formData.body,
      }
  }
}