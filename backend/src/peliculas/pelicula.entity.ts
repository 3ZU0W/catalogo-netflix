import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  anio: number;

  @Column()
  director: string;

  @Column()
  duracion_min: number;

  @Column({ nullable: true })
  sinopsis: string;

  @Column({ type: 'text', nullable: true })
  portada: string;

  @Column({ default: 'en_cartelera' })
  estado: string;

  @Column()
  fechaEstreno: string;

  @Column('simple-array')
  horarios: string[];

  @Column({ type: 'float', default: 35 })
  precioEntrada: number;

  @Column({ default: 'Sala 1' })
  sala: string;

  @Column({ default: false })
  soloMayores18: boolean;

  @Column('simple-json', { default: '[]' })
  generos: { id: number; nombre: string }[];

  @Column('simple-json', { default: '[]' })
  actores: { id: number; nombre: string; apellido: string; personaje?: string }[];

  @Column('simple-json', { default: '[]' })
  valoraciones: { id: number; puntuacion: number; comentario: string; fecha: string; usuario: string }[];

  @Column({ type: 'real', nullable: true })
  promedio_valoraciones: number;

  @Column({ default: true })
  activo: boolean;
}