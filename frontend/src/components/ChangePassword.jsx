import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ChangePassword() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.oldPassword || !form.newPassword || !form.confirmNewPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const message = await changePassword(form.oldPassword, form.newPassword);
      setSuccess(message || 'Password changed successfully.');
      setForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container auth-form">
        <h2>Change Password</h2>

        {success && <div className="message success">{success}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            required
          />
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
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            required
            minLength={6}
          />

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Changing password…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
