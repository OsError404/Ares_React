import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { authenticate } from '../middleware/auth.js';
import Signature from '../models/Signature.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/signatures';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png') {
      cb(new Error('Solo se permiten archivos PNG'));
      return;
    }
    cb(null, true);
  }
});

// Get all signatures
router.get('/', authenticate, async (req, res) => {
  try {
    const signatures = await Signature.find().sort({ name: 1 });
    res.json(signatures);
  } catch (error) {
    console.error('Error al obtener firmas:', error);
    res.status(500).json({ message: 'Error al obtener las firmas' });
  }
});

// Upload new signature
router.post('/', authenticate, upload.single('signature'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
    }

    const { name } = req.body;
    const url = `/uploads/signatures/${req.file.filename}`;

    const signature = new Signature({
      name,
      url,
    });

    await signature.save();
    res.status(201).json(signature);
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }
    console.error('Error al crear firma:', error);
    res.status(500).json({ message: 'Error al crear la firma' });
  }
});

// Delete signature
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const signature = await Signature.findById(req.params.id);
    if (!signature) {
      return res.status(404).json({ message: 'Firma no encontrada' });
    }

    // Delete file
    const filePath = path.join(process.cwd(), signature.url);
    await fs.unlink(filePath);

    // Delete database record
    await signature.deleteOne();
    res.json({ message: 'Firma eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar firma:', error);
    res.status(500).json({ message: 'Error al eliminar la firma' });
  }
});

export default router;