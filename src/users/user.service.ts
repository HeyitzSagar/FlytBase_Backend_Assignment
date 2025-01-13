// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(createUserDto: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new Error('User already registered with this email');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create a new user
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return await user.save();
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error registering user');
    }
  }

  async findByEmail(email: string) {
    try {
      const userDetails = await this.userModel.findOne({ email }).exec();
      if (!userDetails) {
        throw new 
      }
      return userDetails;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Error finding user by email');
    }
  }
}
