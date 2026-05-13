import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.services';
import { CreateObjectDto } from './dto/create-object.dto';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Crée un nouvel objet : upload de l'image puis sauvegarde en base
    return this.objectsService.create(dto, file);
  }

  @Get()
  findAll() {
    // Récupère la liste des objets triés par date de création décroissante
    return this.objectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Récupère un objet par son identifiant
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Supprime l'objet (essaie aussi de supprimer le fichier S3)
    return this.objectsService.remove(id);
  }
}
