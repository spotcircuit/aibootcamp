import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param {string} bucketName - The name of the bucket to upload to
 * @param {string} filePath - The path where the file will be stored in the bucket
 * @param {File|Blob} file - The file to upload
 * @param {string} contentType - The content type of the file
 * @returns {Promise<{publicUrl: string, error: Error|null}>} - The public URL of the uploaded file or an error
 */
export async function uploadFile(bucketName, filePath, file, contentType) {
  try {
    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { publicUrl: null, error };
    }

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { publicUrl: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error uploading file:', error);
    return { publicUrl: null, error };
  }
}

/**
 * Get the public URL of a file in Supabase Storage
 * @param {string} bucketName - The name of the bucket
 * @param {string} filePath - The path of the file in the bucket
 * @returns {string} - The public URL of the file
 */
export function getPublicUrl(bucketName, filePath) {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    if (!data) {
      console.error('No data returned from getPublicUrl');
      return '';
    }
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data && typeof data === 'object' && data.publicUrl) {
      return data.publicUrl;
    }
    
    console.error('Unexpected data format from getPublicUrl:', data);
    return '';
  } catch (error) {
    console.error('Error in getPublicUrl:', error);
    return '';
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucketName - The name of the bucket
 * @param {string} filePath - The path of the file in the bucket
 * @returns {Promise<{success: boolean, error: Error|null}>} - Success status and error if any
 */
export async function deleteFile(bucketName, filePath) {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting file:', error);
    return { success: false, error };
  }
}

/**
 * List all files in a bucket or folder
 * @param {string} bucketName - The name of the bucket
 * @param {string} folderPath - Optional folder path to list files from
 * @returns {Promise<{files: Array, error: Error|null}>} - List of files or an error
 */
export async function listFiles(bucketName, folderPath = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath);

    if (error) {
      console.error('Error listing files:', error);
      return { files: [], error };
    }

    return { files: data, error: null };
  } catch (error) {
    console.error('Unexpected error listing files:', error);
    return { files: [], error };
  }
}