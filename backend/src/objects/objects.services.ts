import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeyamaObject } from './object.entity';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from '../../s3/s3.service';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(HeyamaObject)
    private readonly objectRepository: Repository<HeyamaObject>,
    private readonly s3Service: S3Service,
    private readonly eventsGateway: EventsGateway,
  ) {}

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

  async findAll(): Promise<HeyamaObject[]> {
    return this.objectRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HeyamaObject> {
    const obj: HeyamaObject | null = await this.objectRepository.findOneBy({
      id,
    });
    if (!obj) throw new NotFoundException('Object not found');
    return obj;
  }

  async remove(id: string): Promise<{ message: string }> {
    const obj: HeyamaObject = await this.findOne(id);
    await this.s3Service.deleteFile(obj.imageUrl);
    await this.objectRepository.delete(id);
    this.eventsGateway.emitObjectDeleted(id);
    return { message: 'Deleted successfully' };
  }
}
