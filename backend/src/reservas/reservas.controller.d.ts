import { ReservasService } from './reservas.service';
export declare class ReservasController {
    private service;
    constructor(service: ReservasService);
    crear(body: any): Promise<import("./reserva.entity").Reserva>;
    porUsuario(id: string): Promise<import("./reserva.entity").Reserva[]>;
    ocupacion(peliculaId: string): Promise<{
        dia: string;
        horario: string;
        ocupados: number;
        disponibles: number;
        llena: boolean;
    }[]>;
    todas(): Promise<import("./reserva.entity").Reserva[]>;
    eliminar(id: string): Promise<void>;
    cancelar(id: string): Promise<void>;
}
