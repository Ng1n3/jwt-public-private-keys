import { IuserRegisterUserDto, IUserUpdateDto } from '../dto/user.dto';
import { IUserRepository } from '../repo/user.repository';
import { IUser } from '../schema/User';

export class UserService {
  constructor(private readonly userRepsitory: IUserRepository) {}

  /**
   * Register a new user with password hashing
   */

  async register(userData: IuserRegisterUserDto): Promise<IUser> {
    const existingUser = await this.userRepsitory.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return this.userRepsitory.create(userData);
  }
  /**
   * Get all users (exclude passwords)
   */

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepsitory.findAll();
  }

  /**
   * Get single user by ID
   */

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.userRepsitory.findById(id);
    
    if (!user) throw new Error(`User with id ${id} not found`);
    return user;
  }

  /**
   * Get user by email
   */

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await this.userRepsitory.findByEmail(email);
    
    if (!user) throw new Error(`User with email ${email} not found`);
    return user;
  }

  /**
   * Delete user account
   */

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepsitory.findById(id);
    
    if (!user) throw new Error('User does not exist');
    await this.userRepsitory.delete(id);
  }

  /**
   * Update user profile
   */

  async updateUser(
    id: string,
    userData: IUserUpdateDto
  ): Promise<IUser | null> {
    const checkUser = await this.userRepsitory.findById(id);
    
    if (!checkUser) throw new Error('User does not exist');
    const updatedUser = await this.userRepsitory.update(id, userData);
    
    if (!updatedUser) throw new Error('Updated user not found');
    return updatedUser;
  }
}
