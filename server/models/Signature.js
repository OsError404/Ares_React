import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Índices para mejorar el rendimiento
signatureSchema.index({ name: 1 });
signatureSchema.index({ uploadedBy: 1 });

export default mongoose.model('Signature', signatureSchema);