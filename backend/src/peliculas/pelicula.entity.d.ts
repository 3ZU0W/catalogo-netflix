export declare class Pelicula {
    id: number;
    titulo: string;
    anio: number;
    director: string;
    duracion_min: number;
    sinopsis: string;
    portada: string;
    estado: string;
    fechaEstreno: string;
    horarios: string[];
    funciones: {
        dia: string;
        horarios: string[];
    }[];
    capacidad: number;
    precioEntrada: number;
    sala: string;
    soloMayores18: boolean;
    generos: {
        id: number;
        nombre: string;
    }[];
    actores: {
        id: number;
        nombre: string;
        apellido: string;
        personaje?: string;
    }[];
    valoraciones: {
        id: number;
        puntuacion: number;
        comentario: string;
        fecha: string;
        usuario: string;
    }[];
    promedio_valoraciones: number;
    activo: boolean;
}
