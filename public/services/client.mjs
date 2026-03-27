export async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(data.error || data || "Request failed");
    }

    return data;
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error("You are offline. This feature requires internet.");
    }

    throw new Error(error.message || "Network request failed");
  }
}