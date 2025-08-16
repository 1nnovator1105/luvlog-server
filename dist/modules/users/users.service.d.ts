import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Code } from './entities/code.entity';
import { UserWithRoleDto } from './dto/user-with-role.dto';
export declare class UsersService {
    private userRepository;
    private codeRepository;
    constructor(userRepository: Repository<User>, codeRepository: Repository<Code>);
    findOneByUserId(userId: string): Promise<User | null>;
    findOneWithRole(userId: string): Promise<UserWithRoleDto | null>;
}
