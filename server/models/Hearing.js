import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  documentId: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    enum: ['natural', 'juridico'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['convocado', 'convocador', 'conciliador'],
    required: true,
  },
});

const hearingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Transito', 'Otros'],
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
    enum: ['pendiente', 'en_curso', 'finalizada', 'cancelada'],
    default: 'pendiente',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  conciliator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  claimAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    minlength: 100,
    maxlength: 1000,
  },
  participants: [participantSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento de las consultas
hearingSchema.index({ startDate: 1, endDate: 1 });
hearingSchema.index({ status: 1 });
hearingSchema.index({ conciliator: 1 });
hearingSchema.index({ room: 1 });

export default mongoose.model('Hearing', hearingSchema);