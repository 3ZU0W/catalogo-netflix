import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  director: string;

  @Column()
  anio: number;

  @Column()
  duracion_min: number;

  @Column({ type: 'float' })
  precioEntrada: number;

  @Column()
  sala: string;

  @Column()
  fechaEstreno: string;

  @Column({ nullable: true })
  portada: string;

  @Column({ type: 'text' })
  sinopsis: string;

  @Column({ type: 'simple-array' })
  horarios: string[];

  @Column()
  estado: string;

  @Column({ default: false })
  soloMayores18: boolean;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'json', nullable: true })
  valoraciones: any[];

  @Column({ type: 'float', nullable: true })
  promedio_valoraciones: number;

  @Column({ type: 'json', nullable: true })
  actores: any[];

  @Column({ type: 'json', nullable: true })
  generos: any[];
}