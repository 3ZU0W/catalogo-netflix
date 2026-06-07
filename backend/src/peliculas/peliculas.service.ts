import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private repo: Repository<Pelicula>,
  ) {}

  listar(): Promise<Pelicula[]> {
    return this.repo.find({ where: { activo: true } });
  }

  async buscarPorId(id: number): Promise<Pelicula> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Película no encontrada');
    return p;
  }

  crear(datos: Partial<Pelicula>): Promise<Pelicula> {
    const p = this.repo.create(datos);
    return this.repo.save(p);
  }

  async actualizar(id: number, datos: Partial<Pelicula>): Promise<Pelicula> {
    await this.repo.update(id, datos);
    return this.buscarPorId(id);
  }

  async eliminar(id: number): Promise<void> {
    await this.repo.update(id, { activo: false });
  }

  async agregarValoracion(id: number, valoracion: {
    puntuacion: number; comentario: string; usuario: string;
  }): Promise<Pelicula> {
    const p = await this.buscarPorId(id);
    const nueva = {
      id: Date.now(),
      ...valoracion,
      fecha: new Date().toLocaleDateString('es-BO'),
    };
    p.valoraciones = [...(p.valoraciones || []), nueva];
    const promedio = p.valoraciones.reduce((s, v) => s + v.puntuacion, 0) / p.valoraciones.length;
    p.promedio_valoraciones = promedio;
    return this.repo.save(p);
  }
}