// middleware/uploadMiddleware.mjs
import multer from 'multer';
import storage from '../config/cloudinaryStorage.js';

const upload = multer({ storage });

export default upload;
