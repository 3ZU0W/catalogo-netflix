import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LogAcceso } from './log-acceso.entity';
export declare class AuthService {
    private usuariosService;
    private jwtService;
    private logRepo;
    constructor(usuariosService: UsuariosService, jwtService: JwtService, logRepo: Repository<LogAcceso>);
    login(username: string, password: string, ip: string, browser: string): Promise<{
        token: string;
        usuario: {
            id: number;
            username: string;
            email: string;
            rol: string;
            fechaNacimiento: string;
        };
    }>;
    logout(username: string, ip: string, browser: string): Promise<{
        mensaje: string;
    }>;
    getLogs(): Promise<LogAcceso[]>;
    limpiarLogs(): Promise<{
        mensaje: string;
    }>;
}
