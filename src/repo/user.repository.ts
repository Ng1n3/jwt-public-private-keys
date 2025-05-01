import { IuserRegisterUserDto, IUserUpdateDto } from '../dto/user.dto';
import { IUser, User } from '../schema/User';

export interface IUserRepository {
  create(userData: IuserRegisterUserDto): Promise<IUser>;
  update(id: string, userData: IUserUpdateDto): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async create(userData: IuserRegisterUserDto): Promise<IUser> {
    return User.create(userData);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select('+password');
  }

  async findAll(): Promise<IUser[]> {
    return User.find();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('+password');
  }

  async update(id: string, userData: IUserUpdateDto): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}