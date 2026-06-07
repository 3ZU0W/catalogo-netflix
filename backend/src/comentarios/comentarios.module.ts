import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentario } from './comentario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario])],
  providers: [ComentariosService],
  controllers: [ComentariosController],
})
export class ComentariosModule {}