import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as JwtPayload['role'],
    });

    await this.usersService.updateRefreshTokenHash(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    await this.auditLogsService.create({
      actorId: user.id,
      action: 'auth.login',
      entityType: 'User',
      entityId: user.id,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      ...tokens,
    };
  }

  async signUp(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const researcherRole = await this.usersService.findRoleByName('RESEARCHER');

    if (!researcherRole) {
      throw new ForbiddenException('Researcher role is not configured.');
    }

    const user = await this.usersService.createUser({
      name,
      email,
      passwordHash: await this.hashPassword(password),
      roleId: researcherRole.id,
      status: 'ACTIVE',
    });

    await this.auditLogsService.create({
      actorId: user.id,
      action: 'auth.signup',
      entityType: 'User',
      entityId: user.id,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('No account was found for this email.');
    }

    const updatedUser = await this.usersService.updatePassword(
      user.id,
      await this.hashPassword(newPassword),
    );

    await this.auditLogsService.create({
      actorId: updatedUser.id,
      action: 'auth.password_reset',
      entityType: 'User',
      entityId: updatedUser.id,
    });

    return {
      email: updatedUser.email,
      reset: true,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user.refreshTokenHash) {
      throw new ForbiddenException('Refresh token is not active.');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Invalid refresh token.');
    }

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name as JwtPayload['role'],
    });

    await this.usersService.updateRefreshTokenHash(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);

    await this.auditLogsService.create({
      actorId: userId,
      action: 'auth.logout',
      entityType: 'User',
      entityId: userId,
    });

    return { loggedOut: true };
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async issueTokens(payload: JwtPayload) {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessTtl = this.configService.get<string>('JWT_ACCESS_TTL') ?? '15m';
    const refreshTtl = this.configService.get<string>('JWT_REFRESH_TTL') ?? '7d';

    if (!accessSecret || !refreshSecret) {
      throw new ForbiddenException('JWT secrets are not configured.');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTtl,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
