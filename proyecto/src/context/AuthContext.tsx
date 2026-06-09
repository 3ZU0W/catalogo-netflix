import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Usuario, Reserva, LogAcceso } from "../types/pelicula";
import { api } from "../api/api";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  reservas: Reserva[];
  logs: LogAcceso[];
  login: (username: string, password: string) => Promise<"ok" | "credenciales" | "inactivo">;
  logout: () => Promise<void>;
  registrar: (datos: Omit<Usuario, "id" | "activo" | "fechaRegistro">) => Promise<"ok" | "duplicado">;
  agregarReserva: (r: Omit<Reserva, "id" | "estado">) => Promise<void>;
  cancelarReserva: (id: number) => Promise<void>;
  cargarLogs: () => Promise<void>;
  cargarReservas: () => Promise<void>;
  eliminarReservaAdmin: (id: number) => Promise<void>;
  cargarTodasReservas: () => Promise<Reserva[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const cargarDelStorage = () => {
  try {
    const u = localStorage.getItem("usuario");
    const t = localStorage.getItem("token");
    return { usuario: u ? JSON.parse(u) : null, token: t ?? null };
  } catch {
    return { usuario: null, token: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const inicial = cargarDelStorage();
  const [usuario, setUsuario] = useState<Usuario | null>(inicial.usuario);
  const [token, setToken] = useState<string | null>(inicial.token);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [logs, setLogs] = useState<LogAcceso[]>([]);
  useEffect(() => {
  if (token && usuario) {
    api.getMisReservas(Number(usuario.id), token).then(data => {
      setReservas(data.map((r: any) => ({
        ...r,
        usuarioId: String(r.usuarioId),
        peliculaPortada: r.peliculaPortada ?? null,
        fecha: new Date(r.fecha).toLocaleDateString("es-BO"),
      })));
    });
  }
}, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await api.login(username, password);
      const u: Usuario = {
        id: String(data.usuario.id),
        username: data.usuario.username,
        email: data.usuario.email,
        password: "",
        fechaNacimiento: data.usuario.fechaNacimiento ?? "1990-01-01",
        rol: data.usuario.rol,
        activo: true,
        fechaRegistro: new Date().toISOString().split("T")[0],
      };
      setUsuario(u);
      setToken(data.token);
      localStorage.setItem("usuario", JSON.stringify(u));
      localStorage.setItem("token", data.token);
      const reservasData = await api.getMisReservas(data.usuario.id, data.token);
      setReservas(reservasData.map((r: any) => ({
        ...r,
        usuarioId: String(r.usuarioId),
        peliculaPortada: r.peliculaPortada ?? null,
        fecha: new Date(r.fecha).toLocaleDateString("es-BO"),
      })));
      return "ok";
    } catch {
      return "credenciales";
    }
  }, []);

  const logout = useCallback(async () => {
    if (usuario && token) {
      await api.logout(usuario.username, token);
    }
    setUsuario(null);
    setToken(null);
    setReservas([]);
    setLogs([]);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }, [usuario, token]);

  const registrar = useCallback(async (datos: Omit<Usuario, "id" | "activo" | "fechaRegistro">) => {
    try {
      await api.registro({
        username: datos.username,
        email: datos.email,
        password: datos.password,
        fechaNacimiento: datos.fechaNacimiento,
      });
      return "ok";
    } catch {
      return "duplicado";
    }
  }, []);

  const agregarReserva = useCallback(async (r: Omit<Reserva, "id" | "estado">) => {
    if (!token || !usuario) return;
    const nueva = await api.crearReserva({
      ...r,
      usuarioId: Number(usuario.id),
      usuarioNombre: usuario.username,
    }, token);
    setReservas(prev => [...prev, {
      ...nueva,
      usuarioId: String(nueva.usuarioId),
      peliculaPortada: nueva.peliculaPortada ?? null,
      fecha: new Date(nueva.fecha).toLocaleDateString("es-BO"),
      estado: nueva.estado,
    }]);
  }, [token, usuario]);

  const cancelarReserva = useCallback(async (id: number) => {
    if (!token) return;
    await api.cancelarReserva(id, token);
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: "cancelada" } : r));
  }, [token]);

  const eliminarReservaAdmin = useCallback(async (id: number) => {
    if (!token) return;
    await api.eliminarReservaAdmin(id, token);
  }, [token]);

  const cargarTodasReservas = useCallback(async (): Promise<Reserva[]> => {
    if (!token) return [];
    const data = await api.getTodasReservas(token);
    return data.map((r: any) => ({
      ...r,
      usuarioId: String(r.usuarioId),
      peliculaPortada: r.peliculaPortada ?? null,
      fecha: new Date(r.fecha).toLocaleDateString("es-BO"),
    }));
  }, [token]);

  const cargarLogs = useCallback(async () => {
    if (!token) return;
    const data = await api.getLogs(token);
    setLogs(data.map((l: any) => ({
      ...l,
      fecha: new Date(l.fecha).toLocaleDateString("es-BO"),
      hora: new Date(l.fecha).toLocaleTimeString("es-BO"),
    })));
  }, [token]);

  const cargarReservas = useCallback(async () => {
    if (!token || !usuario) return;
    const data = await api.getMisReservas(Number(usuario.id), token);
    setReservas(data.map((r: any) => ({
      ...r,
      usuarioId: String(r.usuarioId),
      peliculaPortada: r.peliculaPortada ?? null,
      fecha: new Date(r.fecha).toLocaleDateString("es-BO"),
    })));
  }, [token, usuario]);

  return (
    <AuthContext.Provider value={{
      usuario, token, reservas, logs,
      login, logout, registrar,
      agregarReserva, cancelarReserva,
      eliminarReservaAdmin, cargarTodasReservas,
      cargarLogs, cargarReservas,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};


export const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

export const evaluarContrasena = (pass: string): { nivel: "debil" | "media" | "fuerte"; texto: string; color: string } => {
  let puntos = 0;
  if (pass.length >= 8) puntos++;
  if (pass.length >= 12) puntos++;
  if (/[A-Z]/.test(pass)) puntos++;
  if (/[0-9]/.test(pass)) puntos++;
  if (/[^A-Za-z0-9]/.test(pass)) puntos++;
  if (puntos <= 2) return { nivel: "debil", texto: "Contraseña débil", color: "#e50914" };
  if (puntos <= 3) return { nivel: "media", texto: "Contraseña media", color: "#f5a623" };
  return { nivel: "fuerte", texto: "Contraseña fuerte", color: "#4caf50" };
};