import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Document from '../models/Document.js';

const router = express.Router();

// Obtener documentos de una audiencia
router.get('/hearing/:hearingId', authenticate, async (req, res) => {
  try {
    const documents = await Document.find({ hearingId: req.params.hearingId })
      .populate('createdBy', 'name')
      .populate('lastModifiedBy', 'name')
      .sort('-updatedAt');
    
    res.json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener los documentos' });
  }
});

// Crear nuevo documento
router.post('/', authenticate, async (req, res) => {
  try {
    const document = new Document({
      ...req.body,
      createdBy: req.user.userId,
      lastModifiedBy: req.user.userId,
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error al crear el documento' });
  }
});

// Actualizar documento
router.put('/:id', authenticate, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    // Guardar versión anterior en el historial
    document.history.push({
      content: document.content,
      modifiedBy: document.lastModifiedBy,
      modifiedAt: document.updatedAt,
      version: document.version,
    });

    // Actualizar documento
    document.content = req.body.content;
    document.lastModifiedBy = req.user.userId;
    document.version += 1;
    if (req.body.status) document.status = req.body.status;

    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ message: 'Error al actualizar el documento' });
  }
});

// Obtener historial de versiones
router.get('/:id/history', authenticate, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('history.modifiedBy', 'name');
    
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    res.json(document.history);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial' });
  }
});

export default router;