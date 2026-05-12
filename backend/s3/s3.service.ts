import { Injectable } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_S3_REGION || 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    const domain = process.env.AWS_S3_CUSTOM_DOMAIN!;

    const key = `objects/${Date.now()}-${file.originalname}`;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    return `https://${domain}/${key}`;
  }

  async deleteFile(imageUrl: string): Promise<void> {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;

    // extrait proprement la key depuis l’URL AWS
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // enlève "/"

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }
}
