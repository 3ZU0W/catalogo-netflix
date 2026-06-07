import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private repo: Repository<Comentario>,
  ) {}

  listar(): Promise<Comentario[]> {
    return this.repo.find({
      where: { activo: true },
      order: { fecha: 'DESC' },
    });
  }

  crear(datos: { usuarioNombre: string; texto: string; estrellas: number }): Promise<Comentario> {
    const c = this.repo.create(datos);
    return this.repo.save(c);
  }

  async eliminar(id: number): Promise<void> {
    await this.repo.update(id, { activo: false });
  }
}