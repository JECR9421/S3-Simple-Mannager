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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_acl_model_1 = require("../models/s3.acl.model");
const proccessFolder = (folder, fileName) => `${folder}/${fileName}`;
class S3Service {
    constructor(region, endpoint) {
        this.client = new client_s3_1.S3Client({ region, endpoint });
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
