
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },

 
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 

    toObject: { defaults: true },
    toJSON:   { defaults: true },
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;