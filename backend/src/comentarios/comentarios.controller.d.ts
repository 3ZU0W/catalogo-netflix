import { ComentariosService } from './comentarios.service';
export declare class ComentariosController {
    private service;
    constructor(service: ComentariosService);
    listar(): Promise<import("./comentario.entity").Comentario[]>;
    crear(body: {
        usuarioNombre: string;
        texto: string;
        estrellas: number;
    }): Promise<import("./comentario.entity").Comentario>;
    eliminar(id: string): Promise<void>;
}
