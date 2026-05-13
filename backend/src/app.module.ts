import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeyamaObject } from './objects/object.entity';
import { ObjectsModule } from './objects/objects.modules';
import { EventsModule } from './gateway/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [HeyamaObject],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: { rejectUnauthorized: false },
    }),

    ObjectsModule,
    EventsModule,
  ],
})
export class AppModule {}
