import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "../models/s3.model";
import { ACLTypes } from "../models/s3.acl.model";

const proccessFolder = (folder:string, fileName:string) => `${folder}/${fileName}`;
export class S3Service implements S3Util {
    client:S3Client;
    constructor(region:string, endpoint?:string){
        this.client = new S3Client({region, endpoint});
    }
    async upload(bucket: string, fileContent: Buffer, fileName: string, acl: ACLTypes = ACLTypes.private, folder?:string): Promise<boolean> {
        //TODO PARAM EXPIRES PARA TEMP
        const Key = !folder ? fileName : proccessFolder(folder, fileName);
        const input = {Bucket: bucket,Key, Body: fileContent/* ,ACL:acl.toString() */};
        const command = new PutObjectCommand(input);
        const response = await this.client.send(command);
        if(response.ETag) return true;
        return false;
    }

};