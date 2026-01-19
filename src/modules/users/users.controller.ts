import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoleEnum } from '../../common/constants/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() request: CreateUserDto) {
    return this.usersService.register(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/list')
  findAll(@Body() request: PaginationDto) {
    return this.usersService.findAll(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findOne(@CurrentUser('userCode') userCode: string) {
    return this.usersService.findByUserCode(userCode);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(
    @CurrentUser('userCode') userCode: string,
    @Body() request: UpdateUserDto,
  ) {
    return this.usersService.update(userCode, request);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.removeByCode(id);
  }
}
