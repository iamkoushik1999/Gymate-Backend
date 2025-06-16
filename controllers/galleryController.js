// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import galleryModel from '../models/galleryModel.js';
// Helper
import {
  destroyCloudinary,
  extractPublicId,
} from '../helpers/cloudinaryHelper.js';

// ------------------------------------------------------------

/**
 * @POST
 * @desc Upload Single Image
 * @routes /api/v1/gallery/single
 */
export const uploadGallery = expressAsyncHandler(async (req, res) => {
  const { title, alt } = req.body;
  //   console.log('req.body', req.body);
  //   const { image } = req.file;
  const image = req.file;
  //   console.log('req.file', req.file);
  //   console.log('image', image);
  if (!title || !alt || !image || !image.path) {
    res.status(400);
    throw new Error('All fields are required');
  }
  const newGallery = await galleryModel.create({
    title,
    alt,
    image: image.path,
  });

  res.status(200).json({
    success: true,
    message: 'Image for gallery uploaded successfully',
  });
});

/**
 * @POST
 * @desc Upload Multiple Images
 * @routes /api/v1/gallery/multiple
 */
export const uploadMultipleGallery = expressAsyncHandler(async (req, res) => {
  const { title, alt } = req.body;
  //   console.log('req.body', req.body);
  //   const { images } = req.files;
  const images = req.files;
  //   console.log('req.files', req.files);
  //   console.log('images', images);
  if (!title || !alt) {
    res.status(400);
    throw new Error('All fields are required');
  }
  if (images && images.length === 0) {
    res.status(400);
    throw new Error('At least one image is required');
  }
  if (images && images.length > 10) {
    res.status(400);
    throw new Error('You can upload a maximum of 10 images');
  }

  await Promise.all(
    images.map(async (ele) => {
      await galleryModel.create({
        title,
        alt,
        image: ele.path,
      });
    })
  );

  res.status(200).json({
    success: true,
    message: 'Images for gallery uploaded successfully',
  });
});

/**
 * @GET
 * @desc Get All Images
 * @routes /api/v1/gallery
 */
export const getAllGallery = expressAsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const query = {
    isDeleted: false,
  };

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const gallery = await galleryModel
    .find(query)
    .skip(skip)
    .limit(limitNumber)
    // .select('image')
    .lean();
  const count = await galleryModel.countDocuments(query);
  const total = await galleryModel.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(count / limitNumber);

  const images = gallery.map((image) => {
    return {
      _id: image._id,
      title: image.title,
      alt: image.alt,
      image: image.image,
    };
  });

  res.status(200).json({
    success: true,
    data: images,
    total: total,
    count: count,
    limit: limitNumber,
    page: pageNumber,
    pages: totalPages,
  });
});

/**
 * @PUT
 * @desc Update only title and alt
 * @routes /api/v1/gallery/:id
 */
export const updateGallery = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, alt } = req.body;
  const galleryImg = await galleryModel.findById(id);
  if (!galleryImg) {
    res.status(404);
    throw new Error('Image not found');
  }

  await galleryModel.findByIdAndUpdate(id, { title, alt });

  res.status(200).json({
    success: true,
    message: 'Image data updated successfully',
  });
});

/**
 * @DELETE
 * @desc Delete Image
 * @routes /api/v1/gallery/:id
 */
export const deleteGallery = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const galleryImg = await galleryModel.findById(id);
  if (!galleryImg) {
    res.status(404);
    throw new Error('Image not found');
  }
  //   console.log('galleryImg', galleryImg);
  const publicId = extractPublicId(galleryImg?.image);
  //   console.log('publicId', publicId);
  if (publicId) {
    const deletedImage = await destroyCloudinary(publicId);
    // console.log('deletedImage', deletedImage);
  }
  //   await galleryModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Gallery Image deleted successfully',
  });
});
