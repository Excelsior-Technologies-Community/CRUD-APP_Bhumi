

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200?text=No+Image';

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      
      <div className="card-image-wrapper">
        <img
          src={product.imageUrl || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price.toLocaleString()}</p>
        <p className="category">📁 {product.category}</p>

        <div className="card-buttons">
          <button onClick={() => onEdit(product)} className="edit-btn">
            Edit
          </button>
          <button onClick={() => onDelete(product._id)} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
