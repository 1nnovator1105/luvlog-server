import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Code } from './entities/code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Code])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}