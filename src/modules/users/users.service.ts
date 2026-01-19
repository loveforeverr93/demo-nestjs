import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserReponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/interfaces/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async register(request: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: [{ username: request.username }, { email: request.email }],
    });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    return await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, request);
      const hashedPassword = await bcrypt.hash(request.password, 10);
      user.password = hashedPassword;
      const savedUser = await manager.save(user);
      savedUser.userCode = `USER-${savedUser.userId.toString().padStart(3, '0')}`;
      await manager.update(User, savedUser.userId, {
        userCode: savedUser.userCode,
      });
      return {
        __created: true,
        data: this.mapToUserDto(savedUser),
      };
    });
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<UserReponseDto>> {
    const { currentPage, pageSize } = pagination;

    const [users, totalItems] = await this.usersRepository.findAndCount({
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      order: { userCode: 'ASC' },
    });

    return {
      items: users.map((user) => this.mapToUserDto(user)),
      meta: {
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalItems: totalItems,
        totalPages: Math.ceil(users.length / pagination.pageSize),
      },
    };
  }

  async findByUserCode(userCode: string) {
    const user = await this.usersRepository.findOne({ where: { userCode } });
    if (!user) throw new NotFoundException('User not found');
    return this.mapToUserDto(user);
  }

  async update(userCode: string, request: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { userCode } });
    if (!user) throw new NotFoundException('User not found');

    this.usersRepository.merge(user, request);
    await this.usersRepository.save(user);

    return this.mapToUserDto(user);
  }

  async removeByCode(userCode: string) {
    const result = await this.usersRepository.delete(userCode);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return `${userCode} is deleted`;
  }

  private mapToUserDto(user: User): UserReponseDto {
    return new UserReponseDto({
      userCode: user.userCode,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  }
}
