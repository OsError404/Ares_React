import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Location from '../models/Location.js';

const router = express.Router();

// Get all locations
router.get('/', authenticate, async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    res.status(500).json({ message: 'Error al obtener las sedes' });
  }
});

// Create new location
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, prefix, address, department, city } = req.body;

    // Check if location already exists
    const existingLocation = await Location.findOne({ 
      $or: [{ name }, { prefix }] 
    });

    if (existingLocation) {
      return res.status(400).json({ 
        message: 'Ya existe una sede con ese nombre o prefijo' 
      });
    }

    const location = new Location({
      name,
      prefix,
      address,
      department,
      city,
    });

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    console.error('Error al crear sede:', error);
    res.status(500).json({ message: 'Error al crear la sede' });
  }
});

// Update location
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, address, active } = req.body;
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    location.name = name || location.name;
    location.address = address || location.address;
    if (typeof active === 'boolean') location.active = active;

    await location.save();
    res.json(location);
  } catch (error) {
    console.error('Error al actualizar sede:', error);
    res.status(500).json({ message: 'Error al actualizar la sede' });
  }
});

export default router;