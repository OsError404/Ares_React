import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
locationSchema.index({ prefix: 1 }, { unique: true });
locationSchema.index({ city: 1 });
locationSchema.index({ department: 1 });
locationSchema.index({ active: 1 });

export default mongoose.model('Location', locationSchema);