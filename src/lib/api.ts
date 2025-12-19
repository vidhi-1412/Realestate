import { projectId, publicAnonKey } from "../../utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5a209d6f`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    Authorization: `Bearer ${publicAnonKey}`,
    // Only add Content-Type if it's not FormData (which sets it automatically)
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "API Request Failed");
  }

  return response.json();
}

export const api = {
  getProjects: () => fetchAPI("/projects"),
  addProject: (data: any) => fetchAPI("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getClients: () => fetchAPI("/clients"),
  addClient: (data: any) => fetchAPI("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getContactSubmissions: () => fetchAPI("/contact"),
  submitContact: (data: any) => fetchAPI("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getNewsletterSubscriptions: () => fetchAPI("/newsletter"),
  subscribeNewsletter: (email: string) => fetchAPI("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetchAPI("/upload", {
      method: "POST",
      body: formData,
      headers: {},
    });
  }
};
