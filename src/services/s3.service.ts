import { PutObjectCommand, GetObjectCommand ,HeadObjectCommand,S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "../models/s3.model";
import { ACLTypes } from "../models/s3.acl.model";
import fs from "fs";
import { downloadModel } from "../models/s3.download.model";

const proccessFolder = (folder:string, fileName:string) => `${folder}/${fileName}`;

const streamToBuffer = (stream : any) :Promise<Buffer> =>
new Promise((resolve, reject) => {
  const chunks: any[]  = [];
  stream.on("data", (chunk: any) => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks)));
});

const mannageDownloadFile = async (data: Buffer, path:string, fileName: string, bucketInfo: string) => {
    if (!fs.existsSync(path)) { fs.mkdirSync(path) }
    const filePath = `${path}/${fileName}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    fs.writeFileSync(filePath, data);
    if (!fs.existsSync(filePath)) throw new Error(`Fail downloading file ${bucketInfo}`)
}

const mannageDonwloadFileBase64 = (bodyContents: Buffer):string => bodyContents.toString('base64');

export class S3ServiceOperations {
    async upload(bucket: string, fileContent: Buffer, fileName: string, acl: ACLTypes, client:S3Client, folder?: string | undefined): Promise<boolean> {
        const Key = !folder ? fileName : proccessFolder(folder, fileName);
        const input = {Bucket: bucket,Key, Body: fileContent/* ,ACL:acl.toString() */};
        const command = new PutObjectCommand(input);
        const response = await client.send(command);
        if(response.ETag) return true;
        return false;
    }
    async download(bucket: string, fileName: string, client: S3Client, folder?: string | undefined, pathToDownload?: string | undefined): Promise<object> {
        const result = new downloadModel();
        try {
            const Key = !folder ? fileName : proccessFolder(folder, fileName);
            const input = {Bucket: bucket,Key};
            const command = new GetObjectCommand(input);
            const response = await client.send(command);
            const {Body} = response;
            // @ts-ignore
            const bodyContents = await streamToBuffer(Body);
           // const buffer = await createBuffer(response.Body);
            if (pathToDownload) {
                mannageDownloadFile(bodyContents, pathToDownload, fileName, Key);
            }else {
              result.base64 = mannageDonwloadFileBase64(bodyContents);
            }
            delete result.error;
           
        } catch (error) {
            result.success = false;
            result.error = error;
        }
        return result;
    }

    async exits(bucket: string, fileName: string, client: S3Client,  folder?: string | undefined) : Promise<boolean> {
        try {
            const Key = !folder ? fileName : proccessFolder(folder, fileName);
            const input = {Bucket: bucket,Key};
            const command = new HeadObjectCommand(input);
        } catch (error) {
            throw error;
        }
    }

};