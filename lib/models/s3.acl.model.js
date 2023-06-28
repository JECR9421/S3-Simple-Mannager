"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACLTypes = void 0;
var ACLTypes;
(function (ACLTypes) {
    ACLTypes[ACLTypes["private"] = 0] = "private";
    ACLTypes["publicRead"] = "public-read";
    ACLTypes["publicReadWrite"] = "public-read-write";
    ACLTypes["AuthenticatedRead"] = "authenticated-read";
    ACLTypes["AwsExecRead"] = "aws-exec-read";
    ACLTypes["BucketOwnerRead"] = "bucket-owner-read";
    ACLTypes["BucketOwnerFullControl"] = "bucket-owner-full-control";
})(ACLTypes || (exports.ACLTypes = ACLTypes = {}));
