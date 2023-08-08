import { PutObjectCommand, GetObjectCommand ,S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "./models/s3.model";
import { ACLTypes } from "./models/s3.acl.model";
import fs from "fs";
import { Readable } from "stream";
import { downloadModel } from "./models/s3.download.model";

const streamToString = (stream : any) =>
    new Promise((resolve, reject) => {
      const chunks: any[]  = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

    const streamToBuffer = (stream : any) =>
    new Promise((resolve, reject) => {
      const chunks: any[]  = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
const mannageDownloadFile = async (data: any, path:string, fileName: string, bucketInfo: string) => {
    if (!fs.existsSync(path)) { fs.mkdirSync(path) }
    const filePath = `${path}/${fileName}`;
    const inputStream = data;
    await new Promise((resolve, reject) => {
        data.pipe(fs.createWriteStream(filePath))
          .on('error', (err: any) => reject(err))
          .on('close', () => resolve(true))
      })
    if (!fs.existsSync(filePath)) throw new Error(`Fail downloading file ${bucketInfo}`)
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
           // const buffer = await createBuffer(response.Body);
            if (pathToDownload) {
                const {Body} = response;
                // @ts-ignore
                const bodyContents = await streamToBuffer(Body);
                // @ts-ignore
                fs.writeFileSync(`${pathToDownload}/${fileName}`, bodyContents);
                console.log(bodyContents);
            }else {
             // result.base64 = mannageDonwloadFileBase64(buffer);
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