
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Create S3 client
const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://object-storage.nw.r.appspot.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

const BUCKET_NAME = process.env.S3_BUCKET;

async function uploadImages() {
  const imageDir = './attached_assets';
  const files = fs.readdirSync(imageDir).filter(file => file.endsWith('.png'));

  for (const file of files) {
    const fileContent = fs.readFileSync(path.join(imageDir, file));
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `images/bootcamp/${file}`,
        Body: fileContent,
        ContentType: 'image/png'
      }));
      console.log(`Uploaded ${file}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }
}

uploadImages().catch(console.error);
