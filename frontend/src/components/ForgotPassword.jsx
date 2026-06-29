import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      navigate('/verify-otp', {
        state: {
          email,
          message: 'OTP sent successfully to your email.',
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container auth-form">
        <h2>Forgot Password</h2>

        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
