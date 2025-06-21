import { IAuthReponse, IRefreshTokenDTO } from '../dto/auth.dto';
import { IuserLoginDto, IuserRegisterUserDto } from '../dto/user.dto';
import { IUserRepository } from '../repo/user.repository';
import { IUser, User } from '../schema/User';
import { UserService } from '../users/user.service';
import { JwtPayload, JwtUtils } from '../utils/jwt.utils';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService
  ) {}

  async register(userData: IuserRegisterUserDto): Promise<IAuthReponse> {
    const user = await this.userService.register(userData);
    const payload: JwtPayload = { id: user._id.toString(), email: user.email };
    const { accessToken, refreshToken } = JwtUtils.generateTokenPair(payload);

    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      refreshToken
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginData: IuserLoginDto): Promise<IAuthReponse> {
    const { email, password } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.correctPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload: JwtPayload = { id: user._id.toString(), email: user.email };
    const { accessToken, refreshToken } = JwtUtils.generateTokenPair(payload);

    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      refreshToken
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshTokenData: IRefreshTokenDTO
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenData;
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    try {
      const decoded = JwtUtils.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findbyRefreshToken(refreshToken);

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      if (decoded.id !== user._id.toString()) {
        throw new Error('Invalid refresh token');
      }

      if (decoded.email !== user.email) {
        throw new Error('Invalid refresh token');
      }

      const payload: JwtPayload = {
        id: user._id.toString(),
        email: user.email,
      };
      const accessToken = JwtUtils.generateAccessToken(payload);

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresth token');
    }
  }

  async logout(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User Id is required');
    }
    await this.userRepository.clearRefreshToken(userId);
  }

  async getCurrentUser(userId: string): Promise<IUser | null> {
    return this.userRepository.findById(userId);
  }
}
