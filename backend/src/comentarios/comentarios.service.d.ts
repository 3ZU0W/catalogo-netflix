import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
export declare class ComentariosService {
    private repo;
    constructor(repo: Repository<Comentario>);
    listar(): Promise<Comentario[]>;
    crear(datos: {
        usuarioNombre: string;
        texto: string;
        estrellas: number;
    }): Promise<Comentario>;
    eliminar(id: number): Promise<void>;
}
