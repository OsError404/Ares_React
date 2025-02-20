import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../server/models/User.js';

const createAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/hearing-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Datos del administrador
    const adminData = {
      name: 'Administrador',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'ADMIN',
    };

    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email: adminData.email });
    if (existingUser) {
      console.log('Ya existe un usuario con ese correo electrónico');
      process.exit(0);
    }

    // Crear el usuario administrador
    const admin = new User(adminData);
    await admin.save();

    console.log('Usuario administrador creado exitosamente:');
    console.log('Email:', adminData.email);
    console.log('Contraseña:', adminData.password);

  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();