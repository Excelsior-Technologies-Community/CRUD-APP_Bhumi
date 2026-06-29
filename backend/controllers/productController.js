import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const createProduct = async (req, res) => {
  try {
    console.log('[POST] req.body:', req.body);
    console.log('[POST] req.file:', req.file);

    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.create({ name, price, category, image });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product.toObject({ defaults: true }),
        imageUrl: buildImageUrl(req, product.image),
      },
    });
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    res.status(400).json({ success: false, message: error.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithUrls = products.map((p) => ({
      ...p.toObject({ defaults: true }),
      imageUrl: buildImageUrl(req, p.image ?? null),
    }));
    res.status(200).json({ success: true, count: products.length, data: productsWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({
      success: true,
      data: { ...product.toObject({ defaults: true }), imageUrl: buildImageUrl(req, product.image ?? null) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    console.log('[PUT] req.body:', req.body);
    console.log('[PUT] req.file:', req.file);

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, price, category } = req.body;
    const updateData = { name, price, category };

    if (req.file) {
      updateData.image = req.file.filename;
      deleteImageFile(existingProduct.image);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...updatedProduct.toObject({ defaults: true }),
        imageUrl: buildImageUrl(req, updatedProduct.image),
      },
    });
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    deleteImageFile(product.image);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };