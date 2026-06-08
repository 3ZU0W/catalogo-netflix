import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
export declare class ReservasService {
    private repo;
    constructor(repo: Repository<Reserva>);
    private asientosOcupados;
    crear(datos: Partial<Reserva>): Promise<Reserva>;
    listarPorUsuario(usuarioId: number): Promise<Reserva[]>;
    listarTodas(): Promise<Reserva[]>;
    ocupacionPorPelicula(peliculaId: number): Promise<{
        dia: string;
        horario: string;
        ocupados: number;
        disponibles: number;
        llena: boolean;
    }[]>;
    cancelar(id: number): Promise<void>;
    eliminar(id: number): Promise<void>;
}
