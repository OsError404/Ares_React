import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nit: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['aseguradora', 'empresa'],
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
companySchema.index({ nit: 1 }, { unique: true });
companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ type: 1 });
companySchema.index({ active: 1 });

export default mongoose.model('Company', companySchema);