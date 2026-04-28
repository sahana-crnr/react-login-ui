export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export async function readJsonError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!payload) {
    return `Request failed with status ${response.status}`;
  }

  const detail = payload.detail;
  if (typeof detail === "string") {
    return detail;
  }

  const message = payload.message;
  if (typeof message === "string") {
    return message;
  }

  const nonFieldErrors = payload.non_field_errors;
  if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === "string") {
    return nonFieldErrors[0];
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }

    if (typeof value === "string") {
      return value;
    }
  }

  return `Request failed with status ${response.status}`;
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await readJsonError(response));
  }

  return (await response.json()) as T;
}
