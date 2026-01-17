import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';
import { ref } from 'process';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(request: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { username: request.username },
    });

    if (!user) throw new UnauthorizedException('Username not correct');
    const jwt = await this.generateToken(user);
    return {
      message: 'Login successfully',
      accessToken: jwt.accessToken,
      refreshToken: jwt.refreshToken,
    };
  }

  private async generateToken(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.userCode, email: user.email, role: user.role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN'),
      },
    );

    const refreshToken = this.generateRefreshToken();

    const redisKey = `refresh_token:${refreshToken}`;
    await this.redis.set(redisKey, user.userId, 'EX', 60 * 60 * 24 * 7);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    const userId = await this.redis.get(`refresh_token:${refreshToken}`);
    if (!userId)
      throw new UnauthorizedException('Invalid or expired refresh token');

    await this.redis.del(`refresh_token:${refreshToken}`);
    const user = await this.usersRepository.findOne({
      where: { userId: Number(userId) },
    });
    if (!user) throw new BadRequestException('User not found');

    const jwt = await this.generateToken(user);
    return jwt;
  }

  private generateRefreshToken() {
    return randomUUID();
  }

  async logout(refreshToken: string) {
    const redisKey = `refresh_token:${refreshToken}`;
    await this.redis.del(redisKey);
    return { message: 'Logout successfully' };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    return user;
  }
}
