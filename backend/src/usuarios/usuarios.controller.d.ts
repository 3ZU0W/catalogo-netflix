import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private service;
    constructor(service: UsuariosService);
    registrar(body: {
        username: string;
        email: string;
        password: string;
        fechaNacimiento: string;
    }): Promise<import("./usuario.entity").Usuario>;
    listar(): Promise<import("./usuario.entity").Usuario[]>;
    desactivar(id: string): Promise<void>;
}
