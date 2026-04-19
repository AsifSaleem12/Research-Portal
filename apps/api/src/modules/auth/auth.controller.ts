import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { successResponse } from '../../common/utils/api-response';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const data = await this.authService.login(body.email, body.password);
    return successResponse(data, 'Login successful.');
  }

  @Public()
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    const data = await this.authService.signUp(body.name, body.email, body.password);
    return successResponse(data, 'Account created successfully.');
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const data = await this.authService.resetPassword(body.email, body.newPassword);
    return successResponse(data, 'Password updated successfully.');
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RefreshTokenDto,
  ) {
    const data = await this.authService.refresh(user.userId, body.refreshToken);
    return successResponse(data, 'Token refreshed.');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.authService.logout(user.userId);
    return successResponse(data, 'Logout successful.');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return successResponse(user);
  }
}
