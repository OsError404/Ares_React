import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['acta', 'plantilla', 'documento'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  hearingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HearingRequest',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['borrador', 'finalizado'],
    default: 'borrador',
  },
  history: [{
    content: String,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    version: Number,
  }],
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
documentSchema.index({ hearingId: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ createdBy: 1 });
documentSchema.index({ 'history.modifiedBy': 1 });

export default mongoose.model('Document', documentSchema);