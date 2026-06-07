import {
  Controller, Post, UseInterceptors, UploadedFile, UseGuards, Param, Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PeliculasService } from './peliculas.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: 'dutpvet99',
  api_key: '522288592428767',
  api_secret: 'fVQf20eWMOl7yllxQ0DG_1PvCns',
});

async function subirACloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: 'netflick', folder: 'netflick' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

@Controller('peliculas')
export class UploadController {
  constructor(private peliculasService: PeliculasService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/portada')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async subirPortada(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await subirACloudinary(file.buffer, file.originalname);
    return this.peliculasService.actualizar(Number(id), { portada: url });
  }
}