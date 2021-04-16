import { S3 } from 'aws-sdk';
import { resolve } from 'path';
import fs from 'fs';
import mime from 'mime';

import { IStorageProvider } from "../IStorageProvider";
import uploads from '@config/uploads';


class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION,
        });
    }

    async save(file: string, folder: string): Promise<string> {
        const originalName = resolve(uploads.tmpFolder, file);

        const fileContent = await fs.promises.readFile(originalName);

        const contentType = mime.getType(originalName); 

        await this.client.putObject({
            Bucket: `${process.env.AWS_BUCKET}/${folder}`,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType: contentType
        }).promise()

        await fs.promises.unlink(originalName);

        return file;
    }
    async delete(file: string, folder: string): Promise<void> {
        this.client.deleteObject({
            Bucket: `${process.env.AWS_BUCKET}/${folder}`,
            Key: file,
        }).promise();
    }

}

export { S3StorageProvider }