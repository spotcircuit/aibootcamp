
const fs = require('fs');
const path = require('path');
const { s3Client, BUCKET_NAME } = require('./server/s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

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

uploadImages();
