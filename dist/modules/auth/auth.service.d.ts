import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(userId: string, password: string): Promise<UserWithoutPasswordDto | null>;
    login(user: UserWithoutPasswordDto): Promise<LoginResponseDto>;
}
