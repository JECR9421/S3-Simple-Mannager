export declare class File {
    bucket: string;
    folder?: string;
    fileName: string;
    base64: string;
    constructor(bucket: string, fileName: string, folder?: string, base64?: string);
}
