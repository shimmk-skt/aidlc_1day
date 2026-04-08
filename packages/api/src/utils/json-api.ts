// JSON:API response helpers
export const jsonApiSuccess = (data: unknown, meta?: Record<string, unknown>) => {
  const response: Record<string, unknown> = { data };
  if (meta) response.meta = meta;
  return response;
};

export const jsonApiError = (status: number, title: string, detail?: string) => ({
  errors: [{ status: String(status), title, ...(detail && { detail }) }],
});

export const jsonApiList = (data: unknown[], meta?: Record<string, unknown>) => {
  const response: Record<string, unknown> = { data };
  if (meta) response.meta = { ...meta, count: data.length };
  return response;
};
