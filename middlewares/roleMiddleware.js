export const requireRole = (allowedRoles) => (req, res, next) => {
  const role = req.header('x-user-role') || 'guest';

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ error: 'Access denied: insufficient permissions' });
  }

  next();
};
