import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';
export declare class PeliculasService {
    private repo;
    constructor(repo: Repository<Pelicula>);
    listar(): Promise<Pelicula[]>;
    buscarPorId(id: number): Promise<Pelicula>;
    crear(datos: Partial<Pelicula>): Promise<Pelicula>;
    actualizar(id: number, datos: Partial<Pelicula>): Promise<Pelicula>;
    eliminar(id: number): Promise<void>;
    agregarValoracion(id: number, valoracion: {
        puntuacion: number;
        comentario: string;
        usuario: string;
    }): Promise<Pelicula>;
}
