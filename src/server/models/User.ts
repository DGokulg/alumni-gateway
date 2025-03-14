
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  ADMIN = 'admin',
}

// Base schema with common fields for all users
const baseUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STUDENT,
  },
  avatar: {
    type: String,
    default: '',
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Student-specific fields
const studentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [function() { return this.role === UserRole.STUDENT; }, 'Registration number is required for students'],
    trim: true,
  },
});

// Alumni-specific fields
const alumniSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    trim: true,
  },
  graduationYear: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Graduation year is required for alumni'],
  },
  jobTitle: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Job title is required for alumni'],
  },
  companyName: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Company name is required for alumni'],
  },
  industry: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Industry is required for alumni'],
  },
  workExperience: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Work experience is required for alumni'],
  },
  location: {
    type: String,
    required: [function() { return this.role === UserRole.ALUMNI; }, 'Location is required for alumni'],
  },
  linkedinProfile: {
    type: String,
  },
  headline: {
    type: String,
    default: function() {
      return this.jobTitle ? `${this.jobTitle} at ${this.companyName}` : '';
    },
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  education: [{
    institution: {
      type: String,
      default: function() {
        return this.role === UserRole.ALUMNI ? 'Technical University' : '';
      },
    },
    degree: {
      type: String,
    },
    field: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    current: {
      type: Boolean,
      default: false,
    },
  }],
  experience: [{
    company: {
      type: String,
    },
    title: {
      type: String,
    },
    location: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  }],
});

// Combine schemas based on user role
const UserSchema = new mongoose.Schema({
  ...baseUserSchema.obj,
  ...studentSchema.obj,
  ...alumniSchema.obj,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-populate education for alumni based on their program and graduation year
UserSchema.pre('save', function(next) {
  if (this.isNew && this.role === UserRole.ALUMNI) {
    // Initialize education array if it doesn't exist
    this.education = this.education || [];
    
    // Only add default education if none exists
    if (this.education.length === 0) {
      const graduationYear = this.graduationYear;
      const endDate = `${graduationYear}-06-30`;
      const startYear = parseInt(graduationYear) - 4;
      const startDate = `${startYear}-09-01`;
      
      this.education.push({
        institution: 'Technical University',
        degree: 'Bachelor\'s',
        field: this.program,
        startDate,
        endDate,
        current: false,
      });
    }
  }
  next();
});

// Set avatar if not provided
UserSchema.pre('save', function(next) {
  if (!this.avatar) {
    const randomNum = Math.floor(Math.random() * 70);
    this.avatar = `https://i.pravatar.cc/150?img=${randomNum}`;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
