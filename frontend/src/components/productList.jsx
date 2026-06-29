
const PLACEHOLDER_IMAGE = 'https://placehold.co/64x64?text=No+Image';

function ProductList({ products, onEdit, onDelete }) {
  return (
    <>
      {products.length === 0 ? (
        <p className="empty">No products found. Click Create to add one.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-index">#</th>
                <th className="col-image">Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th className="col-actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td className="col-index">{index + 1}</td>
                  <td className="col-image">
                    <img
                      src={product.imageUrl || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      className="thumb"
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>{product.category}</td>
                  <td className="col-actions">
                    <button onClick={() => onEdit(product)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => onDelete(product._id)} className="delete-btn">
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ProductList;
