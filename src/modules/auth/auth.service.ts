import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userId: string,
    password: string,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.usersService.findOneByUserId(userId);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPasswordDto): Promise<LoginResponseDto> {
    const userWithRole = await this.usersService.findOneWithRole(user.userId);

    if (!userWithRole) {
      throw new Error('User not found');
    }

    return {
      USER_NAME: userWithRole.userName,
      USER_ROLE: userWithRole.roleName,
    };
  }
}
