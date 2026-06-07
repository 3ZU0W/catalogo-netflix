import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { ReservasModule } from './reservas/reservas.module';
import { Usuario } from './usuarios/usuario.entity';
import { Pelicula } from './peliculas/pelicula.entity';
import { Reserva } from './reservas/reserva.entity';
import { LogAcceso } from './auth/log-acceso.entity';
import { ComentariosModule } from './comentarios/comentarios.module';
import { Comentario } from './comentarios/comentario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'netflick.db',
      entities: [Usuario, Pelicula, Reserva, LogAcceso, Comentario],
      synchronize: true,
    }),
    AuthModule,
    UsuariosModule,
    PeliculasModule,
    ReservasModule,
    ComentariosModule,
  ],
})
export class AppModule {}