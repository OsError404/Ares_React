import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  modality: {
    type: String,
    enum: ['presencial', 'virtual'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['disponible', 'ocupada', 'mantenimiento'],
    default: 'disponible',
  },
  features: [{
    type: String,
    enum: ['videoconferencia', 'proyector', 'wifi', 'grabacion'],
  }],
  currentHearing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HearingRequest',
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
roomSchema.index({ location: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ modality: 1 });
roomSchema.index({ startDate: 1, endDate: 1 });
roomSchema.index({ active: 1 });

export default mongoose.model('Room', roomSchema);