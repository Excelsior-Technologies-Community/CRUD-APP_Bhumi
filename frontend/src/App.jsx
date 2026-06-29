import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './components/productForm';
import ProductList from './components/productList';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

const API_URL = '/api/products';

function Dashboard() {
  const { logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data.data);
    } catch {
      showMessage('Failed to fetch products', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct._id}`, formData);
        showMessage('Product updated successfully!', 'success');
      } else {
        await axios.post(API_URL, formData);
        showMessage('Product created successfully!', 'success');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
    
      showMessage(err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showMessage('Product deleted!', 'success');
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Product Manager</h1>
        <div className="header-actions">
          <Link to="/change-password" className="link-btn">
            Change Password
          </Link>
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="product-list-header">
        <h2>Products ({products.length})</h2>
        <button type="button" className="create-btn" onClick={handleOpenCreate}>
          Create
        </button>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <Modal onClose={handleCloseModal}>
          <ProductForm
            onSubmit={handleSubmit}
            editingProduct={editingProduct}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
