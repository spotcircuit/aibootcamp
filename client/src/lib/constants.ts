
// S3 Configuration
export const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

// Helper function to get image URLs from our organized folders
export const getImageUrl = (page: string, filename: string) => {
  return `${BUCKET_URL}/images/${page}/${filename}`;
};
