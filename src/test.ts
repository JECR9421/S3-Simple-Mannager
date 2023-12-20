import { S3Service } from ".";
const AWS_REGION = 'us-west-2';
const ENDPOINT = 'https://sfo2.digitaloceanspaces.com';
const bucket = 'fedocumentsstorage';
const fileName = 'test-image.jpg';
const folder = 'CIA602/AGENCIA-TEST';
const pathToDownload = 'C:/DSign/Temp';
const test = async () => {
    const s3Mannager = new S3Service(AWS_REGION, ENDPOINT);
    const result = await s3Mannager.dowload(bucket, fileName, folder, pathToDownload);
    console.log('result', result);
    const result2 = await s3Mannager.exists(bucket, fileName, folder);
}

test();