import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.services';
import { HeyamaObject } from './object.entity';
import { S3Module } from '../../s3/s3.module';
import { EventsModule } from '../../gateway/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([HeyamaObject]), S3Module, EventsModule],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
