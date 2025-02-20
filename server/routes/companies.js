```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Company from '../models/Company.js';

const router = express.Router();

// Get all companies
router.get('/', authenticate, async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ message: 'Error al obtener las empresas' });
  }
});

// Create new company
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, nit, address, phone, email, type } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ 
      $or: [{ nit }, { email }] 
    });

    if (existingCompany) {
      return res.status(400).json({ 
        message: 'Ya existe una empresa con ese NIT o correo electrónico' 
      });
    }

    const company = new Company({
      name,
      nit,
      address,
      phone,
      email,
      type,
      active: true,
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ message: 'Error al crear la empresa' });
  }
});

// Update company
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, address, phone, email, active } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== company.email) {
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ 
          message: 'Ya existe una empresa con ese correo electrónico' 
        });
      }
    }

    company.name = name || company.name;
    company.address = address || company.address;
    company.phone = phone || company.phone;
    company.email = email || company.email;
    if (typeof active === 'boolean') company.active = active;

    await company.save();
    res.json(company);
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ message: 'Error al actualizar la empresa' });
  }
});

// Delete company
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    await Company.deleteOne({ _id: req.params.id });
    res.json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ message: 'Error al eliminar la empresa' });
  }
});

export default router;
```