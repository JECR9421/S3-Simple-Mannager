"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_acl_model_1 = require("./models/s3.acl.model");
const fs_1 = __importDefault(require("fs"));
const s3_download_model_1 = require("./models/s3.download.model");
const streamToBuffer = (stream) => __awaiter(void 0, void 0, void 0, function* () { return Buffer.concat(yield stream.toArray()); });
const createBuffer = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const stream = body;
    const buffer = yield streamToBuffer(stream);
    return buffer;
});
const mannageDownloadFile = (buffer, path, fileName, bucketInfo) => {
    if (!fs_1.default.existsSync(path)) {
        fs_1.default.mkdirSync(path);
    }
    fs_1.default.writeFileSync(path, buffer);
    if (!fs_1.default.existsSync(`${path}/${fileName}`))
        throw new Error(`Fail downloading file ${bucketInfo}`);
};
const mannageDonwloadFileBase64 = (buffer) => buffer.toString('base64');
const proccessFolder = (folder, fileName) => `${folder}/${fileName}`;
class S3Service {
    constructor(region, endpoint) {
        this.client = new client_s3_1.S3Client({ region, endpoint });
    }
    dowload(bucket, fileName, folder, pathToDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new s3_download_model_1.downloadModel();
            try {
                const Key = !folder ? fileName : proccessFolder(folder, fileName);
                const input = { Bucket: bucket, Key };
                const command = new client_s3_1.GetObjectCommand(input);
                const response = yield this.client.send(command);
                const buffer = yield createBuffer(response.Body);
                if (pathToDownload) {
                    mannageDownloadFile(buffer, pathToDownload, fileName, `${bucket}/${Key}`);
                    delete result.base64;
                }
                else {
                    result.base64 = mannageDonwloadFileBase64(buffer);
                }
                delete result.error;
            }
            catch (error) {
                result.success = false;
                result.error = error;
            }
            return result;
        });
    }
    upload(bucket, fileContent, fileName, acl = s3_acl_model_1.ACLTypes.private, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO PARAM EXPIRES PARA TEMP
            const Key = !folder ? fileName : proccessFolder(folder, fileName);
            const input = { Bucket: bucket, Key, Body: fileContent /* ,ACL:acl.toString() */ };
            const command = new client_s3_1.PutObjectCommand(input);
            const response = yield this.client.send(command);
            if (response.ETag)
                return true;
            return false;
        });
    }
}
exports.S3Service = S3Service;
;
