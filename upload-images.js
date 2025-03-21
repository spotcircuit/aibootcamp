
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { images } from './shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT || "https://object-storage.nw.r.appspot.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

const BUCKET_NAME = process.env.S3_BUCKET;

async function uploadImages() {
  const imageDir = path.join(__dirname, 'attached_assets');
  const files = fs.readdirSync(imageDir).filter(file => file.endsWith('.png'));

  for (const file of files) {
    const fileContent = fs.readFileSync(path.join(imageDir, file));
    const s3Path = `images/bootcamp/${file}`;
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Path,
        Body: fileContent,
        ContentType: 'image/png'
      }));

      // Save image record to database
      await db.insert(images).values({
        filename: file,
        path: s3Path
      });

      console.log(`Uploaded ${file} and saved to database`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

uploadImages().catch(console.error);
