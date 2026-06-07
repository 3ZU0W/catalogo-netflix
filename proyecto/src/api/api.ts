const BASE = 'http://localhost:3000';

const headers = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    return res.json();
  },

  logout: async (username: string, token: string) => {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ username }),
    });
  },

  registro: async (datos: {
    username: string;
    email: string;
    password: string;
    fechaNacimiento: string;
  }) => {
    const res = await fetch(`${BASE}/usuarios`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Usuario o email ya existe');
    return res.json();
  },

  // Películas
  getPeliculas: async () => {
    const res = await fetch(`${BASE}/peliculas`);
    return res.json();
  },

  crearPelicula: async (datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  actualizarPelicula: async (id: number, datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas/${id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  eliminarPelicula: async (id: number, token: string) => {
    await fetch(`${BASE}/peliculas/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
  },

  valorarPelicula: async (id: number, datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas/${id}/valoracion`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  // Reservas
  crearReserva: async (datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/reservas`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  getMisReservas: async (usuarioId: number, token: string) => {
    const res = await fetch(`${BASE}/reservas/usuario/${usuarioId}`, {
      headers: headers(token),
    });
    return res.json();
  },

  cancelarReserva: async (id: number, token: string) => {
    await fetch(`${BASE}/reservas/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
  },

  // Logs
  getLogs: async (token: string) => {
    const res = await fetch(`${BASE}/auth/logs`, {
      headers: headers(token),
    });
    return res.json();
  },
  
  subirPortada: async (id: number, archivo: File, token: string) => {
    const formData = new FormData();
    formData.append('file', archivo);
    const res = await fetch(`${BASE}/peliculas/${id}/portada`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  getTodasReservas: async (token: string) => {
    const res = await fetch(`${BASE}/reservas`, {
      headers: headers(token),
    });
    return res.json();
  },
  
  limpiarLogs: async (token: string) => {
    await fetch(`${BASE}/auth/logs`, {
      method: 'DELETE',
      headers: headers(token),
    });
  },

  // Comentarios
  getComentarios: async () => {
    const res = await fetch(`${BASE}/comentarios`);
    return res.json();
  },

  crearComentario: async (datos: { usuarioNombre: string; texto: string; estrellas: number }, token: string) => {
    const res = await fetch(`${BASE}/comentarios`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return res.json();
  },

  eliminarComentario: async (id: number, token: string) => {
    await fetch(`${BASE}/comentarios/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
  },
};