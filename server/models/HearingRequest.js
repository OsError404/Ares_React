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

const hearingRequestSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Transito', 'Otros'],
    required: true,
  },
  hearingDateTime: {
    type: Date,
    required: true,
  },
  claimAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  claimDetails: {
    damages: Number,
    deductible: Number,
    subrogation: Number,
  },
  vehicleCount: {
    type: Number,
    min: 0,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 100,
    maxlength: 1000,
  },
  additionalDetails: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
    default: 'pendiente',
  },
  participants: [participantSchema],
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  comments: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
hearingRequestSchema.index({ caseNumber: 1 }, { unique: true });
hearingRequestSchema.index({ type: 1 });
hearingRequestSchema.index({ status: 1 });
hearingRequestSchema.index({ hearingDateTime: 1 });
hearingRequestSchema.index({ requestedBy: 1 });
hearingRequestSchema.index({ assignedRoom: 1 });
hearingRequestSchema.index({ 'participants.documentId': 1 });

export default mongoose.model('HearingRequest', hearingRequestSchema);