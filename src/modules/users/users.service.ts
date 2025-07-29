import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Code } from './entities/code.entity';
import { UserWithRoleDto } from './dto/user-with-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {}

  async findOneByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { userId },
    });
  }

  async findOneWithRole(userId: string): Promise<UserWithRoleDto | null> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      return null;
    }

    const roleCode = await this.codeRepository.findOne({
      where: {
        codeUnit: 'USER_ROLE',
        codeId: user.userRole,
      },
    });

    return {
      userId: user.userId,
      userName: user.userName,
      userRole: user.userRole,
      roleName: roleCode?.codeName || user.userRole,
      createDate: user.createDate,
    };
  }
}
