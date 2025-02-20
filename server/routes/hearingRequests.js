import express from 'express';
import { authenticate } from '../middleware/auth.js';
import HearingRequest from '../models/HearingRequest.js';
import Room from '../models/Room.js';

const router = express.Router();

// Obtener audiencias en curso
router.get('/current', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const currentHearings = await HearingRequest.find({
      status: 'aprobada',
      hearingDateTime: {
        $lte: now,
        $gte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
      },
    })
    .populate('assignedRoom')
    .populate('requestedBy', 'name email')
    .populate('participants');

    const formattedHearings = currentHearings.map(hearing => ({
      id: hearing._id,
      type: hearing.type,
      startTime: hearing.hearingDateTime,
      room: {
        name: hearing.assignedRoom.name,
        location: hearing.assignedRoom.location,
      },
      conciliator: {
        name: hearing.participants.find(p => p.role === 'conciliador')?.name || 'No asignado',
      },
      participants: hearing.participants.map(p => ({
        name: p.name,
        role: p.role,
      })),
    }));

    res.json(formattedHearings);
  } catch (error) {
    console.error('Error al obtener audiencias en curso:', error);
    res.status(500).json({ message: 'Error al obtener las audiencias' });
  }
});

// Obtener todas las solicitudes (con filtros)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, startDate, endDate, type } = req.query;
    const query = { requestedBy: req.user.userId };

    if (status) query.status = status;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.hearingDateTime = {};
      if (startDate) query.hearingDateTime.$gte = new Date(startDate);
      if (endDate) query.hearingDateTime.$lte = new Date(endDate);
    }

    const hearingRequests = await HearingRequest.find(query)
      .sort({ hearingDateTime: 1 })
      .populate('assignedRoom')
      .populate('requestedBy', 'name email');

    res.json(hearingRequests);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ message: 'Error al obtener las solicitudes' });
  }
});

// Resto del código existente...

export default router;