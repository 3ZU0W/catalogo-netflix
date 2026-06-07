import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}

  async crear(datos: {
    username: string;
    email: string;
    password: string;
    fechaNacimiento: string;
    rol?: string;
  }): Promise<Usuario> {
    const existe = await this.repo.findOne({
      where: [{ username: datos.username }, { email: datos.email }],
    });
    if (existe) throw new ConflictException('Usuario o email ya existe');

    const hash = await bcrypt.hash(datos.password, 10);
    const usuario = this.repo.create({ ...datos, password: hash });
    return this.repo.save(usuario);
  }

  async buscarPorUsername(username: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { username } });
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.repo.findOne({ where: { id } });
  }

  async listar(): Promise<Usuario[]> {
    return this.repo.find();
  }

  async desactivar(id: number): Promise<void> {
    await this.repo.update(id, { activo: false });
  }
}