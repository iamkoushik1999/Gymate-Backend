// Packages
import expressAsyncHandler from 'express-async-handler';
// Models
import contactUsModel from '../models/contactusModel.js';

// ------------------------------------------------------------

/**
 * @POST
 * @access Public
 * @desc Create a new contact us entry
 * @route /api/v1/contactus
 */
export const createContactUs = expressAsyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, class: className, comment } = req.body;
  if (!fullName || !email || !phoneNumber || !className || !comment) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Create a new contact us entry
  const newContactUs = await contactUsModel.create({
    fullName,
    email,
    phoneNumber,
    class: className,
    comment,
  });

  res.status(201).json({
    success: true,
    message: 'Message sent, we will get back to you soon',
  });
});

/**
 * @GET
 * @access Admin
 * @desc Get all contact us entries
 * @route /api/v1/contactus
 */
export const getAllContactUs = expressAsyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {
    isDeleted: false,
  };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Fetch all contact us entries
  const pipeline = [
    {
      $match: query,
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phoneNumber: 1,
        class: 1,
        comment: 1,
        createdAt: 1,
      },
    },
  ];

  const contactUsEntries = await contactUsModel.aggregate(pipeline);
  const totalEntries = await contactUsModel.countDocuments({
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: contactUsEntries,
    total: totalEntries,
  });
});

/**
 * @GET
 * @access Admin
 * @desc Get a contact us entry by ID
 * @route /api/v1/contactus/:id
 */
export const getContactUsById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the contact us entry by ID
  const contactUsEntry = await contactUsModel.findById(id);
  if (!contactUsEntry) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(200).json({
    success: true,
    data: contactUsEntry,
  });
});

/**
 * @DELETE
 * @access Admin
 * @desc Delete a contact us entry by ID
 * @route /api/v1/contactus/:id
 */
export const deleteContactUs = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  //   Soft delete the contact us entry
  const contactUsEntry = await contactUsModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!contactUsEntry) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});
