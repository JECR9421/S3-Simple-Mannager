export enum ACLTypes {
    private,
    publicRead = 'public-read' ,
    publicReadWrite = 'public-read-write' ,
    AuthenticatedRead = 'authenticated-read' ,
    AwsExecRead = 'aws-exec-read' ,
    BucketOwnerRead = 'bucket-owner-read' ,
    BucketOwnerFullControl = 'bucket-owner-full-control'
}