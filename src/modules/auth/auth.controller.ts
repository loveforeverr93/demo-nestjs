import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() request: LoginDto) {
    return this.authService.login(request);
  }

  @Post('refresh')
  refreshAccessToken(@Body() request: RefreshTokenDto) {
    return this.authService.refreshAccessToken(request.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() request: RefreshTokenDto) {
    return this.authService.logout(request.refreshToken);
  }
}
