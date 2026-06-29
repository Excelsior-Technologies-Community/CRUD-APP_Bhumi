import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const redirectMessage = location.state?.message;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="auth-container">
        <div className="form-container auth-form">
          <h2>Verify OTP</h2>
          <div className="message error">
            No email found for verification. Please start again.
          </div>
          <p className="auth-switch">
            <Link to="/forgot-password">Back to Forgot Password</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP sent to your email.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      navigate('/reset-password', { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container auth-form">
        <h2>Verify OTP</h2>

        {redirectMessage && <div className="message success">{redirectMessage}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" value={email} readOnly />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          <Link to="/forgot-password">Resend OTP</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
