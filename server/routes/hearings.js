import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Hearing from '../models/Hearing.js';

const router = express.Router();

// Create a new hearing
router.post('/', authenticate, async (req, res) => {
  try {
    const hearing = new Hearing({
      ...req.body,
      createdBy: req.user.userId,
    });
    
    await hearing.save();
    res.status(201).json(hearing);
  } catch (error) {
    console.error('Error creating hearing:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get all hearings (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;
    const query = { createdBy: req.user.userId };

    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.hearingDateTime = {};
      if (startDate) query.hearingDateTime.$gte = new Date(startDate);
      if (endDate) query.hearingDateTime.$lte = new Date(endDate);
    }

    const hearings = await Hearing.find(query).sort({ hearingDateTime: 1 });
    res.json(hearings);
  } catch (error) {
    console.error('Error fetching hearings:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get a specific hearing
router.get('/:id', authenticate, async (req, res) => {
  try {
    const hearing = await Hearing.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!hearing) {
      return res.status(404).json({ message: 'Audiencia no encontrada' });
    }

    res.json(hearing);
  } catch (error) {
    console.error('Error fetching hearing:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Update a hearing
router.put('/:id', authenticate, async (req, res) => {
  try {
    const hearing = await Hearing.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!hearing) {
      return res.status(404).json({ message: 'Audiencia no encontrada' });
    }

    // Only allow updates if the hearing is pending
    if (hearing.status !== 'pendiente') {
      return res.status(400).json({ 
        message: 'No se puede modificar una audiencia que no está pendiente' 
      });
    }

    Object.assign(hearing, req.body);
    await hearing.save();
    res.json(hearing);
  } catch (error) {
    console.error('Error updating hearing:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Cancel a hearing
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const hearing = await Hearing.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!hearing) {
      return res.status(404).json({ message: 'Audiencia no encontrada' });
    }

    if (hearing.status !== 'pendiente' && hearing.status !== 'aprobada') {
      return res.status(400).json({ 
        message: 'Solo se pueden cancelar audiencias pendientes o aprobadas' 
      });
    }

    hearing.status = 'cancelada';
    await hearing.save();
    res.json(hearing);
  } catch (error) {
    console.error('Error canceling hearing:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;