import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repo/user.repository';
import { JwtUtils } from '../utils/jwt.utils';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class AuthMiddleware {
  constructor(private userRepository: UserRepository) {}

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers['authorization'];
      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        res.status(401).json({
          status: 'FAIL',
          message: 'Access token not provided',
          data: null,
        });
        return;
      }

      // verify token
      const decoded = JwtUtils.verifyAccessToken(token);

      // check if user still exists
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        res.status(401).json({
          status: 'FAIL',
          message: 'User no longer exists',
          data: null,
        });
      }

      // attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (error: any) {
      res.status(401).json({
        status: 'FAIL',
        message: 'Invalid or expired token',
        data: null,
      });
    }
  };

  validateRefreshToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          status: 'FAIL',
          message: 'Refresh token not provided',
          data: null,
        });
      }

      const decoded = JwtUtils.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findbyRefreshToken(refreshToken);

      if (!user) {
        return res.status(401).json({
          status: 'FAIL',
          message: 'Invalid refresh token',
          data: null,
        });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (error: any) {
      return res.status(401).json({
        status: 'FAIL',
        message: 'Invalid or expired refresh token',
        data: null,
      });
    }
  };
}
