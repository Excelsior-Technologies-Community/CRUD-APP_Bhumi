import express from 'express';
const router = express.Router();

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

import { handleUpload } from '../middleware/uploadMiddleware.js';
import protect from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, handleUpload, createProduct)
  .get(getAllProducts);


router.route('/:id')
  .get(getProductById)
  .put(protect, handleUpload, updateProduct)
  .delete(protect, deleteProduct);

export default router;
