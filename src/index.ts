import { S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "./models/s3.model";
import { ACLTypes } from "./models/s3.acl.model";
import { S3ServiceOperations } from "./services/s3.service";


const proccessFolder = (folder:string, fileName:string) => `${folder}/${fileName}`;
export class S3Service implements S3Util {
    client:S3Client;
    constructor(region:string, endpoint?:string){
        this.client = new S3Client({region, endpoint});
    }
    async dowload(bucket: string, fileName: string, folder?: string | undefined, pathToDownload?:string): Promise<object> {
        const operations = new S3ServiceOperations();
        return operations.download(bucket, fileName, this.client, folder, pathToDownload);
    }
    async upload(bucket: string, fileContent: Buffer, fileName: string, acl: ACLTypes = ACLTypes.private, folder?:string): Promise<boolean>{
        const operations = new S3ServiceOperations();
        return operations.upload(bucket, fileContent, fileName,acl, this.client, folder);
    }

};