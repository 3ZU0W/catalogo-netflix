import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { UploadController } from './upload.controller';
import { Pelicula } from './pelicula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula])],
  providers: [PeliculasService],
  controllers: [PeliculasController, UploadController],
  exports: [PeliculasService],
})
export class PeliculasModule {}