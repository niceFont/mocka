export const formatHeaders = (
  headers: Array<Record<string, string>>,
): Record<string, string> | undefined => {
  if (!headers) return undefined;
  return headers.reduce((acc, header) => {
    acc[header.key] = header.value;
    return acc;
  }, {} as Record<string, string>);
};
