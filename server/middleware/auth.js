import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { sanitize } from 'express-mongo-sanitize';
import helmet from 'helmet';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rate limiting
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos
  message: {
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.',
  },
});

// Autenticación JWT
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Sanitización de datos
export const sanitizeData = (req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};

// Configuración de seguridad
export const securityMiddleware = [
  helmet(), // Cabeceras de seguridad
];