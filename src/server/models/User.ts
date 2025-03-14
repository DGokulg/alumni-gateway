
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  ADMIN = 'admin',
}

// Define interfaces for better type safety
export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface IExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  program: string;
  createdAt: Date;
  registrationNumber?: string;
  phoneNumber?: string;
  graduationYear?: string;
  jobTitle?: string;
  companyName?: string;
  industry?: string;
  workExperience?: string;
  location?: string;
  linkedinProfile?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  connections?: mongoose.Types.ObjectId[];
  education?: IEducation[];
  experience?: IExperience[];
  matchPassword(enteredPassword: string): Promise<boolean>;
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
    required: function(this: any) { 
      return this.role === UserRole.STUDENT; 
    },
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
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  jobTitle: {
    type: String,
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  companyName: {
    type: String,
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  industry: {
    type: String,
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  workExperience: {
    type: String,
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  location: {
    type: String,
    required: function(this: any) { 
      return this.role === UserRole.ALUMNI; 
    },
  },
  linkedinProfile: {
    type: String,
  },
  headline: {
    type: String,
    default: function(this: any) {
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
      default: function(this: any) {
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
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to check if password is correct
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-populate education for alumni based on their program and graduation year
UserSchema.pre('save', function(next) {
  if (this.isNew && this.role === UserRole.ALUMNI) {
    // Initialize education array if it doesn't exist
    if (!this.education) {
      this.education = [];
    }
    
    // Only add default education if none exists
    if (Array.isArray(this.education) && this.education.length === 0) {
      const graduationYear = this.graduationYear as string;
      const endDate = `${graduationYear}-06-30`;
      const startYear = parseInt(graduationYear) - 4;
      const startDate = `${startYear}-09-01`;
      
      const educationItem = {
        institution: 'Technical University',
        degree: 'Bachelor\'s',
        field: this.program,
        startDate,
        endDate,
        current: false,
      };
      
      this.education.push(educationItem);
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

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
