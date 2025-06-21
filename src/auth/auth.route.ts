import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { UserRepository } from '../repo/user.repository';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const router = Router();
const userRepository = new UserRepository();

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, userService);
const authController = new AuthController(authService);
const authMiddleWare = new AuthMiddleware(userRepository);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleWare.authenticate, authController.logout);
router.get('/me', authMiddleWare.authenticate, authController.getCurrentUser);

export { router as AuthRouter };