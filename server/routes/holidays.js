import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Holiday from '../models/Holiday.js';

const router = express.Router();

// Get all holidays
router.get('/', authenticate, async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    console.error('Error al obtener días festivos:', error);
    res.status(500).json({ message: 'Error al obtener los días festivos' });
  }
});

// Create new holiday
router.post('/', authenticate, async (req, res) => {
  try {
    const { date, description, recurring } = req.body;

    // Check if holiday already exists
    const existingHoliday = await Holiday.findOne({ date });
    if (existingHoliday) {
      return res.status(400).json({
        message: 'Ya existe un día festivo en esa fecha'
      });
    }

    const holiday = new Holiday({
      date,
      description,
      recurring,
    });

    await holiday.save();
    res.status(201).json(holiday);
  } catch (error) {
    console.error('Error al crear día festivo:', error);
    res.status(500).json({ message: 'Error al crear el día festivo' });
  }
});

// Update holiday
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { description, recurring } = req.body;
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({ message: 'Día festivo no encontrado' });
    }

    holiday.description = description || holiday.description;
    if (typeof recurring === 'boolean') holiday.recurring = recurring;

    await holiday.save();
    res.json(holiday);
  } catch (error) {
    console.error('Error al actualizar día festivo:', error);
    res.status(500).json({ message: 'Error al actualizar el día festivo' });
  }
});

export default router;