import { PeliculasService } from './peliculas.service';
export declare class UploadController {
    private peliculasService;
    constructor(peliculasService: PeliculasService);
    subirPortada(id: string, file: Express.Multer.File): Promise<import("./pelicula.entity").Pelicula>;
}
