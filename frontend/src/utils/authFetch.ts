export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token"); // Obtener el token de localStorage
  if (!token) throw new Error('No hay token en localStorage'); // Verificar si hay token

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,  // Aquí se agrega el token al header
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

