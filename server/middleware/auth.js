import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'spfoods_jwt_secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
}
