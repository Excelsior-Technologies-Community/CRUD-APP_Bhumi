
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;


  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]; // "Bearer <token>" -> "<token>"
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — user no longer exists',
      });
    }

    req.user = user;
    next(); 
  } catch (error) {
  
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired — please log in again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — invalid token',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

export default protect;
