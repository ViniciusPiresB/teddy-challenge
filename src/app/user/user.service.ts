import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHashed = hashSync(createUserDto.password, 10);
    const user = await this.prismaService.user.create({
      data: { ...createUserDto, password: passwordHashed },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found.');

    if (user.status == Status.DELETED) throw new BadRequestException('User deleted.');

    return user;
  }

  async delete(email: string) {
    const user = await this.findByEmail(email);

    const date = new Date().toISOString();

    const deletedUser = await this.prismaService.user.update({
      where: user,
      data: {
        status: Status.DELETED,
        deletedAt: date,
      },
    });

    return deletedUser;
  }
}
