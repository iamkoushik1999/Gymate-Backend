// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import classModel from '../models/classModel.js';
import trainerModel from '../models/trainerModel.js';
// Helpers
import {
  destroyCloudinary,
  extractPublicId,
} from '../helpers/cloudinaryHelper.js';

// ------------------------------------------------------------

/**
 * @POST
 * @desc Create a new class
 * @routes /api/v1/class
 */
export const createClass = expressAsyncHandler(async (req, res) => {
  const { title, description, trainer } = req.body;
  if (!title || !description || !trainer) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const image = req.file.path;
  if (!image) {
    res.status(400);
    throw new Error('Image is required');
  }

  const trainerExists = await trainerModel.findById(trainer);
  if (!trainerExists) {
    res.status(404);
    throw new Error('Trainer not found');
  }

  const newClass = await classModel.create({
    title: title,
    description: description,
    image: image,
    trainer: trainer,
  });
  res.status(201).json({
    success: true,
    message: 'New Class added successfully',
  });
});

/**
 * @GET
 * @desc Get all classes
 * @routes /api/v1/class
 */
export const getAllClasses = expressAsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const query = {
    isDeleted: false,
  };

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const pipeline = [
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limitNumber },
    {
      $lookup: {
        from: 'trainers',
        localField: 'trainer',
        foreignField: '_id',
        as: 'trainer',
      },
    },
    { $unwind: '$trainer' },
    {
      $project: {
        _id: 1,
        title: 1,
        image: 1,
        trainer: {
          _id: '$trainer._id',
          fname: '$trainer.fname',
          lname: '$trainer.lname',
          image: '$trainer.image',
        },
      },
    },
  ];

  const classes = await classModel.aggregate(pipeline);

  const count = await classModel.countDocuments(query);
  const total = await classModel.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(count / limitNumber);

  const classData = classes.map((ele) => {
    return {
      _id: ele?._id,
      title: ele?.title,
      image: ele?.image,
      trainer: ele?.trainer,
    };
  });

  res.status(200).json({
    success: true,
    data: classData,
    total: total,
    count: count,
    limit: limitNumber,
    page: pageNumber,
    pages: totalPages,
  });
});

/**
 * @GET
 * @desc Get single class
 * @routes /api/v1/class/:id
 */
export const getSingleClass = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const singleClass = await classModel.findById(id).populate('trainer');
  if (!singleClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  const classData = {
    _id: singleClass?._id,
    title: singleClass?.title,
    description: singleClass?.description,
    image: singleClass?.image,
    trainer: {
      _id: singleClass?.trainer?._id,
      fname: singleClass?.trainer?.fname,
      lname: singleClass?.trainer?.lname,
      image: singleClass?.trainer?.image,
      expertise: singleClass?.trainer?.expertise,
      email: singleClass?.trainer?.email,
      phoneNumber: singleClass?.trainer?.phoneNumber,
    },
  };

  res.status(200).json({
    success: true,
    data: classData,
  });
});

/**
 * @PUT
 * @desc Update class
 * @routes /api/v1/class/:id
 */
export const updateClass = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const singleClass = await classModel.findById(id);
  if (!singleClass) {
    res.status(404);
    throw new Error('Class not found');
  }
  if (req.file) {
    req.body.image = req.file.path;
  }
  const updatedClass = await classModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    data: updatedClass,
  });
});

/**
 * @DELETE
 * @desc Delete class
 * @routes /api/v1/class/:id
 */
export const deleteClass = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const classData = await classModel.findById(id);
  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  const publicId = extractPublicId(classData?.image);
  if (publicId) {
    const deletedImage = await destroyCloudinary(publicId);
  }
  await classModel.findByIdAndUpdate(
    id,
    { image: '', isDeleted: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Class deleted successfully',
  });
});
