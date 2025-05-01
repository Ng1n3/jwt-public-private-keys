import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  constructor(private UserService: UserService) {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.UserService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await this.UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const user = await this.UserService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await this.UserService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.UserService.deleteUser(req.params.id);
      res.status(204).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}