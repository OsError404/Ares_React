import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { loginLimiter, sanitizeData } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Función para generar contraseña aleatoria
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Función para enviar correo con credenciales
const sendCredentials = async (email, password) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Credenciales de Acceso - Sistema Ares',
    html: `
      <h1>Bienvenido al Sistema Ares</h1>
      <p>Sus credenciales de acceso son:</p>
      <p><strong>Correo electrónico:</strong> ${email}</p>
      <p><strong>Contraseña:</strong> ${password}</p>
      <p>Por favor, cambie su contraseña después de iniciar sesión por primera vez.</p>
      <p>No comparta estas credenciales con nadie.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

router.post('/login', loginLimiter, sanitizeData, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/register', sanitizeData, async (req, res) => {
  try {
    const { fullName, documentType, documentNumber, email, roles, locationId } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [
        { email },
        { documentNumber }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Ya existe un usuario con ese correo o número de documento'
      });
    }

    // Generar contraseña aleatoria
    const password = generatePassword();

    // Crear el usuario
    const user = new User({
      name: fullName,
      documentType,
      documentNumber,
      email,
      password,
      roles,
      locationId,
    });

    await user.save();

    // Enviar credenciales por correo
    await sendCredentials(email, password);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada exitosamente' });
});

export default router;