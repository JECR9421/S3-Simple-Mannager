/// <reference types="node" />
import { S3Client } from "@aws-sdk/client-s3";
import { S3Util } from "./models/s3.model";
import { ACLTypes } from "./models/s3.acl.model";
export declare class S3Service implements S3Util {
    client: S3Client;
    constructor(region: string, endpoint?: string);
    dowload(bucket: string, fileName: string, folder?: string | undefined, pathToDownload?: string): Promise<object>;
    upload(bucket: string, fileContent: Buffer, fileName: string, acl?: ACLTypes, folder?: string): Promise<boolean>;
}
