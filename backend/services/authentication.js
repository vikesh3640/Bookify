const JWT = require('jsonwebtoken');
const secret = "$uperMan@123";

function createTokenForUser(user, res) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);

  // Set token in cookie with appropriate settings
  res.cookie('token', token, {
    httpOnly: true,  // The cookie cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // Set to true when in production (HTTPS)
    sameSite: 'None',  // Allows cross-origin requests
    maxAge: 3600000,  // Cookie expiration time (1 hour)
  });

  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
