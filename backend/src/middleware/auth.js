import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'Authentication required'});
  }

  try {
    const userInfo = jwt.verify(token, JWT_SECRET);
    req.user = userInfo;
    return next();
  } catch (error) {
    return res.status(401).json({message: 'Invalid or expired token'});
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({message: 'Admin access required'});
  }
  return next();
};
