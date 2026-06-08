import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
export declare class UsuariosService {
    private repo;
    constructor(repo: Repository<Usuario>);
    crear(datos: {
        username: string;
        email: string;
        password: string;
        fechaNacimiento: string;
        rol?: string;
    }): Promise<Usuario>;
    buscarPorUsername(username: string): Promise<Usuario | null>;
    buscarPorId(id: number): Promise<Usuario | null>;
    listar(): Promise<Usuario[]>;
    desactivar(id: number): Promise<void>;
}
