export async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data.error || data || "Request failed");
  }

  return data;
}