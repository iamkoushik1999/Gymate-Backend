// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import trainerModel from '../models/trainerModel.js';

// ------------------------------------------------------------

/**
 * @POST
 * @desc Create a new trainer
 * @routes /api/v1/trainer
 */
export const createTrainer = expressAsyncHandler(async (req, res) => {
  const {
    fname,
    lname,
    expertise,
    description,
    email,
    phoneNumber,
    facebook,
    instagram,
    twitter,
    linkedin,
    youtube,
  } = req.body;
  if (
    !fname ||
    !lname ||
    !expertise ||
    !description ||
    !email ||
    !phoneNumber
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const image = req.file;
  if (!image) {
    res.status(400);
    throw new Error('Image is required');
  }

  const newTrainer = await trainerModel.create({
    fname: fname,
    lname: lname,
    image: image.path,
    expertise: expertise,
    description: description,
    email: email,
    phoneNumber: phoneNumber,
    facebook: facebook,
    instagram: instagram,
    twitter: twitter,
    linkedin: linkedin,
    youtube: youtube,
  });

  res.status(201).json({
    success: true,
    message: 'Trainer created successfully',
  });
});

/**
 * @GET
 * @desc Get all trainers
 * @routes /api/v1/trainer
 */
export const getAllTrainers = expressAsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const query = {
    isDeleted: false,
  };

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const trainers = await trainerModel
    .find(query)
    .skip(skip)
    .limit(limitNumber)
    .lean();

  const count = await trainerModel.countDocuments(query);
  const total = await trainerModel.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(count / limitNumber);

  const trainersData = trainers.map((trainer) => {
    return {
      _id: trainer._id,
      fname: trainer.fname,
      lname: trainer.lname,
      image: trainer.image,
      expertise: trainer.expertise,
      description: trainer.description,
      email: trainer.email,
      phoneNumber: trainer.phoneNumber,
      facebook: trainer.facebook,
      instagram: trainer.instagram,
      twitter: trainer.twitter,
      linkedin: trainer.linkedin,
      youtube: trainer.youtube,
    };
  });

  res.status(200).json({
    success: true,
    data: trainersData,
    total: total,
    count: count,
    limit: limitNumber,
    page: pageNumber,
    pages: totalPages,
  });
});

/**
 * @GET
 * @desc Get single trainer
 * @routes /api/v1/trainer/:id
 */
export const getSingleTrainer = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const trainer = await trainerModel.findById(id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  res.status(200).json({
    success: true,
    data: trainer,
  });
});

/**
 * @PUT
 * @desc Update trainer
 * @routes /api/v1/trainer/:id
 */
export const updateTrainer = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const trainer = await trainerModel.findById(id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  if (req.file) {
    req.body.image = req.file.path;
  }
  const updatedTrainer = await trainerModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    data: updatedTrainer,
  });
});

/**
 * @DELETE
 * @desc Delete trainer
 * @routes /api/v1/trainer/:id
 */
export const deleteTrainer = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const trainer = await trainerModel.findById(id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  await trainerModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  res.status(200).json({
    success: true,
    message: 'Trainer deleted successfully',
  });
});
