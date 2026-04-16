export const BASE_URL = "http://localhost:8080";
//const BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
}
export const getImageUrl = (path: string) => {
  if (!path) return "https://placehold.co/400x600?text=No+Poster";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/uploads/movies/${path}`;
};