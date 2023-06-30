import { PutObjectCommand, GetObjectCommand ,S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "./models/s3.model";
import { ACLTypes } from "./models/s3.acl.model";
import fs from "fs";
import { Readable } from "stream";
import { downloadModel } from "./models/s3.download.model";

const streamToBuffer = async(stream:any) => Buffer.concat(await stream.toArray());

const createBuffer = async(body: any) => {
    const stream = body as Readable
    const buffer = await streamToBuffer(stream);
    return buffer;
}

const mannageDownloadFile = (buffer: Buffer, path:string, fileName: string, bucketInfo: string) => {
    if (!fs.existsSync(path)) { fs.mkdirSync(path) }
    fs.writeFileSync(path, buffer)
    if (!fs.existsSync(`${path}/${fileName}`)) throw new Error(`Fail downloading file ${bucketInfo}`)
}

const mannageDonwloadFileBase64 = (buffer:Buffer) => buffer.toString('base64'); 

const proccessFolder = (folder:string, fileName:string) => `${folder}/${fileName}`;
export class S3Service implements S3Util {
    client:S3Client;
    constructor(region:string, endpoint?:string){
        this.client = new S3Client({region, endpoint});
    }
    async dowload(bucket: string, fileName: string, folder?: string | undefined, pathToDownload?:string): Promise<object> {
        const result = new downloadModel();
        try {
            const Key = !folder ? fileName : proccessFolder(folder, fileName);
            const input = {Bucket: bucket,Key};
            const command = new GetObjectCommand(input);
            const response = await this.client.send(command);
            const buffer = await createBuffer(response.Body);
            if (pathToDownload) {
                mannageDownloadFile(buffer, pathToDownload, fileName, `${bucket}/${Key}`);
                delete result.base64;
            }else {
             result.base64 = mannageDonwloadFileBase64(buffer);
            }
            delete result.error;
           
        } catch (error) {
            result.success = false;
            result.error = error;
        }
        return result;
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