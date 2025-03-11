
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'alumni'], required: true },
  avatar: { type: String },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  headline: { type: String },
  bio: { type: String },
  skills: [String],
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    graduationYear: Number
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model('User', userSchema);
