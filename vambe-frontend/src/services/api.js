const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getClients(skip = 0, limit = 100) {
  const res = await fetch(`${API_URL}/clients/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error("Error fetching clients");
  return res.json();
}


export async function getClientsWithCategories() {
  const res = await fetch(`${API_URL}/clients/categories/all`);
  if (!res.ok) throw new Error("Error fetching clients with categories");
  return res.json();
}


export async function getClientById(clientId) {
  const res = await fetch(`${API_URL}/clients/${clientId}`);
  if (!res.ok) throw new Error("Error fetching client");
  return res.json();
}


export async function getClientCategory(clientId) {
  const res = await fetch(`${API_URL}/clients/${clientId}/category`);
  if (!res.ok) throw new Error("Error fetching client category");
  return res.json();
}


export async function getAllCategories() {
  const res = await fetch(`${API_URL}/categories/`);
  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}


export async function getCategoryById(categoryId) {
  const res = await fetch(`${API_URL}/categories/${categoryId}`);
  if (!res.ok) throw new Error("Error fetching category");
  return res.json();
}


export async function getCategoryByClientId(clientId) {
  const res = await fetch(`${API_URL}/categories/client/${clientId}`);
  if (!res.ok) throw new Error("Error fetching category by client id");
  return res.json();
}