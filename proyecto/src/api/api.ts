const BASE = 'https://catalogo-netflix-production-91aa.up.railway.app';

const headers = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Helper central: revisa res.ok antes de parsear.
// Si la respuesta no es OK, lanza un Error con el mensaje del backend
// (o uno genérico) en vez de devolver el objeto de error como si fueran datos válidos.
async function parseResponse(res: Response) {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // body vacío o no es JSON
  }

  if (!res.ok) {
    const mensaje =
      data?.message ||
      (res.status === 401
        ? 'Sesión expirada o no autorizada, vuelve a iniciar sesión'
        : `Error ${res.status}`);
    throw new Error(mensaje);
  }

  return data;
}

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
    return parseResponse(res);
  },

  crearPelicula: async (datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return parseResponse(res);
  },

  actualizarPelicula: async (id: number, datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas/${id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return parseResponse(res);
  },

  eliminarPelicula: async (id: number, token: string) => {
    const res = await fetch(`${BASE}/peliculas/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
    return parseResponse(res);
  },

  valorarPelicula: async (id: number, datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/peliculas/${id}/valoracion`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return parseResponse(res);
  },

  // Reservas
  crearReserva: async (datos: unknown, token: string) => {
    const res = await fetch(`${BASE}/reservas`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return parseResponse(res);
  },

  getMisReservas: async (usuarioId: number, token: string) => {
    const res = await fetch(`${BASE}/reservas/usuario/${usuarioId}`, {
      headers: headers(token),
    });
    return parseResponse(res);
  },

  cancelarReserva: async (id: number, token: string) => {
    const res = await fetch(`${BASE}/reservas/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
    return parseResponse(res);
  },

  getTodasReservas: async (token: string) => {
    const res = await fetch(`${BASE}/reservas`, {
      headers: headers(token),
    });
    return parseResponse(res);
  },

  eliminarReservaAdmin: async (id: number, token: string) => {
    const res = await fetch(`${BASE}/reservas/${id}/eliminar`, {
      method: 'DELETE',
      headers: headers(token),
    });
    return parseResponse(res);
  },

  // OJO: esta función ahora SIEMPRE devuelve un array.
  // Si hay un error (401, 403, 500, etc.), lo logueamos en consola
  // y devolvemos [] en vez de propagar un objeto de error que rompería
  // los .map()/.find() del componente que la consume.
  getOcupacion: async (peliculaId: number, token: string) => {
    try {
      const res = await fetch(`${BASE}/reservas/ocupacion/${peliculaId}`, {
        headers: headers(token),
      });
      const data = await parseResponse(res);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error al obtener ocupación:', err);
      return [];
    }
  },

  getLogs: async (token: string) => {
    const res = await fetch(`${BASE}/auth/logs`, {
      headers: headers(token),
    });
    return parseResponse(res);
  },

  subirPortada: async (id: number, archivo: File, token: string) => {
    const formData = new FormData();
    formData.append('file', archivo);
    const res = await fetch(`${BASE}/peliculas/${id}/portada`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return parseResponse(res);
  },

  limpiarLogs: async (token: string) => {
    const res = await fetch(`${BASE}/auth/logs`, {
      method: 'DELETE',
      headers: headers(token),
    });
    return parseResponse(res);
  },

  getComentarios: async () => {
    const res = await fetch(`${BASE}/comentarios`);
    return parseResponse(res);
  },

  crearComentario: async (
    datos: { usuarioNombre: string; texto: string; estrellas: number },
    token: string,
  ) => {
    const res = await fetch(`${BASE}/comentarios`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(datos),
    });
    return parseResponse(res);
  },

  eliminarComentario: async (id: number, token: string) => {
    const res = await fetch(`${BASE}/comentarios/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
    return parseResponse(res);
  },
};