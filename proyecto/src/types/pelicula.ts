export interface Genero {
  id: number;
  nombre: string;
}

export interface Actor {
  id: number;
  nombre: string;
  apellido: string;
  personaje?: string;
}

export interface Valoracion {
  id: number;
  puntuacion: number;
  comentario: string;
  fecha: string;
  usuario: string | null;
  usuarioEdad?: number;
}

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  director: string;
  duracion_min: number;
  generos: Genero[];
  actores: Actor[];
  valoraciones: Valoracion[];
  portada: string | null;
  promedio_valoraciones: number | null;
  activo: boolean;

  estado: "en_cartelera" | "proximo_estreno";
  fechaEstreno: string;       
  horarios: string[];     
  funciones: { dia: string; horarios: string[] }[]; 
  capacidad: number;        
  precioEntrada: number;      
  sala: string;               
  soloMayores18: boolean;
  sinopsis: string;
}

export interface Reserva {
  id: number;
  peliculaId: number;
  peliculaTitulo: string;
  peliculaPortada: string | null;
  usuarioId: string;
  usuarioNombre?: string; 
  dia?: string; 
  horario: string;
  asientos: number;
  total: number;
  fecha: string;
  estado: "confirmada" | "cancelada";
  sala: string;
}

export interface Usuario {
  id: string;
  username: string;
  email: string;
  password: string;          
  fechaNacimiento: string;   
  rol: "admin" | "cliente";
  activo: boolean;
  fechaRegistro: string;
}

export interface LogAcceso {
  id: number;
  usuario: string;
  evento: "ingreso" | "salida";
  fecha: string;
  hora: string;
  browser: string;
  ip: string;
}
