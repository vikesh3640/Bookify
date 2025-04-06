const { validateToken } = require("../services/authentication");

function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = validateToken(token);
    req.user = user;  // Attach user data to request object
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { checkAuth };
