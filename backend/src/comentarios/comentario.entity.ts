import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioNombre: string;

  @Column()
  texto: string;

  @Column({ type: 'int', default: 5 })
  estrellas: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ default: true })
  activo: boolean;
}