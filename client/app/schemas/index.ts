import * as yup from "yup"

const httpMethodRegex = /^(GET|POST|PATCH|PUT|DELETE)$/g
const contentTypes = ["application/json", "text/plain"]
const contentTypesRegex = new RegExp(contentTypes.join("|"), "g")
export const EndpointSchema = yup.object().shape({
  status: yup.number()
    .typeError("Status must be a number")
    .min(100, "Status must be greater than 100")
    .max(599, "Status must be less than 599")
    .required("Status is required"),
  method: yup.string().required("Method is required")
    .matches(httpMethodRegex, "Method must be a valid HTTP method"),
  contentType: yup.string().matches(contentTypesRegex, "Content-Type is not valid").required("Content-Type is required"),
  headers: yup.array(yup.object({
    key: yup.string().required("Header key is required"),
    value: yup.string().required("Header value is required")
  })).optional().nullable().default(null),
  body: yup.string().optional().nullable().default(null)
})

