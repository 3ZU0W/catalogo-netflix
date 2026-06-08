import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  peliculaId: number;

  @Column()
  peliculaTitulo: string;

  @Column({ nullable: true })
  peliculaPortada: string;

  @Column()
  usuarioId: number;

  @Column()
  usuarioNombre: string;

  @Column({ default: '' })
  dia: string;

  @Column()
  horario: string;

  @Column()
  asientos: number;

  @Column({ type: 'float' })
  total: number;

  @Column()
  sala: string;

  @Column({ default: 'confirmada' })
  estado: string;

  @CreateDateColumn()
  fecha: Date;
}