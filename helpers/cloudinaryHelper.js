import { v2 as cloudinary } from 'cloudinary';
 
/**
 * @desc Extract public id from image url
 * @param {*} imageUrl
 * @returns
 */
export const extractPublicId = (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');

    // Extract everything *after* the version segment
    const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
    const publicPathParts = parts.slice(versionIndex + 1);

    const fileName = publicPathParts.join('/');

    return fileName.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('Failed to extract publicId from URL:', error);
    return null;
  }
};

/**
 * @desc Delete image from cloudinary
 * @param {*} publicId
 * @returns
 */
export const destroyCloudinary = async (publicId) => {
  try {
    return cloudinary.uploader.destroy(publicId);
  } catch (error) {
    return null;
  }
};
