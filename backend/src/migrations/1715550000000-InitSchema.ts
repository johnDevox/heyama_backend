import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1715550000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "objects" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "title" character varying NOT NULL,
      "description" character varying NOT NULL,
      "imageUrl" character varying NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "objects";`);
  }
}
