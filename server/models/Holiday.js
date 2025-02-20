import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
holidaySchema.index({ date: 1 }, { unique: true });
holidaySchema.index({ recurring: 1 });

export default mongoose.model('Holiday', holidaySchema);