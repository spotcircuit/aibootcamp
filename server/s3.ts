import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY || !process.env.S3_BUCKET) {
  throw new Error("Missing required S3 configuration");
}

export const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export const BUCKET_NAME = process.env.S3_BUCKET;
export const BUCKET_URL = `https://${BUCKET_NAME}.s3.amazonaws.com`;

// Helper function to get image URLs from our organized folders
export const getImageUrl = (page: string, filename: string) => {
  return `${BUCKET_URL}/images/${page}/${filename}`;
};