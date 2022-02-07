export async function getHeaders(form: FormData) {

  const keys = form.getAll('headers[key]') as Array<string>
  const values = form.getAll('headers[value]') as Array<string>

  const headers: Record<string, string> = {}

  keys.forEach((key: string, index: number) => {
    headers[key] = values[index]
  })

  return headers
}


