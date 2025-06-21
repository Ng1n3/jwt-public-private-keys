import * as bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  refreshToken?:string
  createdAt: Date;
  updatedAt: Date;
  correctPassword: (password: string, hash: string) => Promise<boolean>;
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    id: { type: Schema.Types.UUID, ref: 'User' },
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name must be at most 50 characters long'],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      minlength: [4, 'Password must be at least 8 characters long'],
      maxlength: [20, 'Password must be at most 20 characters long'],
      select: false,
      validate: {
        validator: function (password: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            password
          );
        },
        message:
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    refreshToken: {
      type: String,
      select: false,
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Password hashing middleware
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
