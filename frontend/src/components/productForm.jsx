import { useState, useEffect, useRef } from 'react';

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200?text=No+Image';

function ProductForm({ onSubmit, editingProduct, onCancel }) {
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);      
  const [imagePreview, setImagePreview] = useState(null); 
  const fileInputRef = useRef(null);                    


  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
      });
      setImagePreview(editingProduct.imageUrl || null);
      setImageFile(null); 
    } else {
      resetForm();
    }
  }, [editingProduct?._id]); 

  
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '' });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (!file) return;

      setImageFile(file);

      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);

    if (imageFile) {
      data.append('image', imageFile); 
    }

    onSubmit(data);

    if (!editingProduct) resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="form-container">
      <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        
        <div className="image-upload-section">
          <label className="image-upload-label">
            {editingProduct
              ? 'Replace Image (optional)'
              : 'Product Image (optional)'}
          </label>

          <input
            type="file"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            ref={fileInputRef}
            className="file-input"
          />

          
          {imagePreview ? (
            <div className="image-preview-wrapper">
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
              />
              {imageFile && (
                <p className="image-preview-label">
                  New image selected: <strong>{imageFile.name}</strong>
                </p>
              )}
              {!imageFile && editingProduct && (
                <p className="image-preview-label">Current image (upload new to replace)</p>
              )}
            </div>
          ) : (
            <div className="image-placeholder">
              <span>No image selected</span>
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;