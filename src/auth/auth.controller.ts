import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private authService: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        status: 'OK',
        message: 'Token created',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'FAIL',
        message: error.message,
        data: null,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'OK',
        messaged: 'Logged in successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        status: 'FAIL',
        message: error.message,
        data: null,
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await this.authService.refreshToken({ refreshToken });

      res.status(200).json({
        status: 'OK',
        message: 'access token sucessfully created',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        status: 'FAIL',
        message: error.message,
        data: null,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      await this.authService.logout(userId);

      res.clearCookie('refreshToken');
      res.status(200).json({
        status: 'OK',
        message: 'successfully logged out',
        data: null,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message,
        data: null,
      });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const user = await this.authService.getCurrentUser(userId);

      res.status(200).json({
        status: 'OK',
        message: 'current user retrieved successfully',
        data: { user },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message,
        data: null,
      });
    }
  }
}
