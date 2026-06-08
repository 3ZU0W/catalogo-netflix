import { PeliculasService } from './peliculas.service';
export declare class PeliculasController {
    private service;
    constructor(service: PeliculasService);
    listar(): Promise<import("./pelicula.entity").Pelicula[]>;
    chatbaseFeed(): Promise<string>;
    buscar(id: string): Promise<import("./pelicula.entity").Pelicula>;
    crear(body: any): Promise<import("./pelicula.entity").Pelicula>;
    actualizar(id: string, body: any): Promise<import("./pelicula.entity").Pelicula>;
    eliminar(id: string): Promise<void>;
    valorar(id: string, body: any): Promise<import("./pelicula.entity").Pelicula>;
}
