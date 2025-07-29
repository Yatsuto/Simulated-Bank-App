// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // will contain { id }
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
}

module.exports = auth;
