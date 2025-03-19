// Helper functions for cloud storage
import { BUCKET_URL } from "../../../server/s3";

export const getImageUrl = (page: string, filename: string) => {
  return `${BUCKET_URL}/images/${page}/${filename}`;
};
