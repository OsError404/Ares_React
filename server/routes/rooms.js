import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Room from '../models/Room.js';

const router = express.Router();

// Get all rooms
router.get('/', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('location', 'name')
      .sort({ 'location.name': 1, name: 1 });
    res.json(rooms);
  } catch (error) {
    console.error('Error al obtener salas:', error);
    res.status(500).json({ message: 'Error al obtener las salas' });
  }
});

// Create new room
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, locationId, modality, startDate, endDate } = req.body;

    // Check if room already exists in location
    const existingRoom = await Room.findOne({
      location: locationId,
      name,
    });

    if (existingRoom) {
      return res.status(400).json({
        message: 'Ya existe una sala con ese nombre en esta sede'
      });
    }

    const room = new Room({
      name,
      location: locationId,
      modality,
      startDate,
      endDate,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error('Error al crear sala:', error);
    res.status(500).json({ message: 'Error al crear la sala' });
  }
});

// Update room
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, modality, startDate, endDate, active } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    room.name = name || room.name;
    room.modality = modality || room.modality;
    room.startDate = startDate || room.startDate;
    room.endDate = endDate || room.endDate;
    if (typeof active === 'boolean') room.active = active;

    await room.save();
    res.json(room);
  } catch (error) {
    console.error('Error al actualizar sala:', error);
    res.status(500).json({ message: 'Error al actualizar la sala' });
  }
});

export default router;