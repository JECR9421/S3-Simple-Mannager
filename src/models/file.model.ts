export class File{
    bucket:string;
    folder?:string;
    fileName:string;
    base64:string;
    constructor(bucket:string,fileName:string, folder?:string, base64?:string ){
        this.bucket = bucket;
        this.folder = folder;
        this.fileName = fileName;
        this.base64 = base64 || '';
    }
};