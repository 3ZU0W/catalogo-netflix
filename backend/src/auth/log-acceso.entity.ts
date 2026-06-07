import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column()
  evento: string;

  @Column()
  ip: string;

  @Column()
  browser: string;

  @CreateDateColumn()
  fecha: Date;
}