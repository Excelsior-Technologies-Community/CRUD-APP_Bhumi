import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    return (
      <div className="auth-container">
        <div className="form-container auth-form">
          <h2>Reset Password</h2>
          <div className="message error">
            Missing verification details. Please restart the password reset process.
          </div>
          <p className="auth-switch">
            <Link to="/forgot-password">Back to Forgot Password</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.newPassword || !form.confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword: form.newPassword,
      });
      navigate('/login', { state: { message: 'Password reset successfully.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container auth-form">
        <h2>Reset Password</h2>

        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password (min 6 characters)"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting password…' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
