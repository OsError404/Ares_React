import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: String,
    enum: ['ADMIN', 'CONCILIATOR', 'RECEPTIONIST', 'ARCHIVE', 'REQUESTS', 'NOTIFICATIONS'],
    default: ['REQUESTS'],
  }],
  documentType: {
    type: String,
    enum: ['CC', 'CE', 'PE'],
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

userSchema.methods.hasAnyRole = function(roles) {
  return this.roles.some(role => roles.includes(role));
};

// Índices para mejorar el rendimiento
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ documentNumber: 1 }, { unique: true });
userSchema.index({ roles: 1 });
userSchema.index({ locationId: 1 });
userSchema.index({ active: 1 });

export default mongoose.model('User', userSchema);