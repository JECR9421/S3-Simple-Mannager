"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
class File {
    constructor(bucket, fileName, folder, base64) {
        this.bucket = bucket;
        this.folder = folder;
        this.fileName = fileName;
        this.base64 = base64 || '';
    }
}
exports.File = File;
;
