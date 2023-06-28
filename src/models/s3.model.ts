import { ACLTypes } from "./s3.acl.model";

export interface S3Util {
    upload(bucket:string,fileContent: Buffer, fileName:string, acl:ACLTypes, folder?:string): Promise<boolean>
}