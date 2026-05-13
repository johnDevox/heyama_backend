import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeyamaObject } from './object.entity';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from '../s3/s3.service';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class ObjectsService {
  private readonly logger = new Logger(ObjectsService.name);
  constructor(
    @InjectRepository(HeyamaObject)
    private readonly objectRepository: Repository<HeyamaObject>,
    private readonly s3Service: S3Service,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // Upload l'image sur S3, crée l'entité et la sauvegarde en base
  async create(
    dto: CreateObjectDto,
    file: Express.Multer.File,
  ): Promise<HeyamaObject> {
    const imageUrl: string = await this.s3Service.uploadFile(file);
    const obj: HeyamaObject = this.objectRepository.create({
      ...dto,
      imageUrl,
    });
    const saved: HeyamaObject = await this.objectRepository.save(obj);
    this.eventsGateway.emitObjectCreated(saved);
    return saved;
  }

  // Retourne tous les objets, triés par date de création décroissante
  async findAll(): Promise<HeyamaObject[]> {
    return this.objectRepository.find({ order: { createdAt: 'DESC' } });
  }

  // Retourne un objet par son ID ou lève une NotFoundException
  async findOne(id: string): Promise<HeyamaObject> {
    const obj: HeyamaObject | null = await this.objectRepository.findOneBy({
      id,
    });
    if (!obj) throw new NotFoundException('Object not found');
    return obj;
  }

  // Supprime l'objet : tente de supprimer le fichier S3 puis supprime la ligne en base
  async remove(id: string): Promise<{ message: string }> {
    const obj: HeyamaObject = await this.findOne(id);

    try {
      await this.s3Service.deleteFile(obj.imageUrl);
    } catch (err: unknown) {
      // Log the S3 error but continue to delete the DB record.
      // AccessDenied is common when the credentials lack delete permissions.
      const errMsg = (() => {
        try {
          return JSON.stringify(err, Object.getOwnPropertyNames(err));
        } catch {
          return String(err);
        }
      })();

      this.logger.warn(`S3 delete failed for key ${obj.imageUrl}: ${errMsg}`);
    }

    await this.objectRepository.delete(id);

    try {
      this.eventsGateway.emitObjectDeleted(id);
    } catch (emitErr) {
      this.logger.warn(`Failed to emit object deleted event: ${emitErr}`);
    }

    return { message: 'Deleted successfully' };
  }
}
