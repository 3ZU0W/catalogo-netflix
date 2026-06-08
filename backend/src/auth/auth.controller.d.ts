import { AuthService } from './auth.service';
import type { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }, req: Request): Promise<{
        token: string;
        usuario: {
            id: number;
            username: string;
            email: string;
            rol: string;
            fechaNacimiento: string;
        };
    }>;
    logout(body: {
        username: string;
    }, req: Request): Promise<{
        mensaje: string;
    }>;
    getLogs(): Promise<import("./log-acceso.entity").LogAcceso[]>;
    limpiarLogs(): Promise<{
        mensaje: string;
    }>;
}
