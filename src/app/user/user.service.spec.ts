import { PrismaService } from '../../database/prisma.service';
import { UserService } from './user.service';
import { Status, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const fakeUsers: User[] = [
    {
      name: 'Test User 1',
      password: 'pass123',
      id: 'a3718843-5456-4482-9c97-a20f78cbd44e',
      email: 'test@user.com',
      username: 'testuser1',
      typeUser: 1,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      name: 'Test User 2',
      password: 'pass123',
      id: 'a37546843-5436-4482-4c97-a20f78cdwgd3',
      email: 'test@user.com',
      username: 'testuser2',
      typeUser: 1,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const updatedFakeUser: User = {
    ...fakeUsers[0],
    name: 'Updated Test User 1',
    password: 'updatedpass123',
    email: 'updatedemail@user.com',
    username: 'updatedtestuser1',
    updatedAt: new Date(),
  };

  const prismaMock = {
    user: {
      create: jest.fn().mockReturnValue(fakeUsers[0]),
      findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
      update: jest.fn().mockReturnValue(updatedFakeUser),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    prismaMock.user.create.mockClear();
    prismaMock.user.findUnique.mockClear();
    prismaMock.user.update.mockClear();
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('Should create an user successfully', async () => {
      const userToBeCreated: CreateUserDto = {
        email: fakeUsers[0].email,
        password: fakeUsers[0].password,
        username: fakeUsers[0].username,
        name: fakeUsers[0].name,
      };

      const user = await userService.create(userToBeCreated);

      expect(user).toStrictEqual(fakeUsers[0]);
      expect(user.status).toEqual(Status.ACTIVE);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });

    it('Should not create a duplicated user', async () => {
      const prismaError = new PrismaClientKnownRequestError('Unique constraint failed on the constraint: `User_cpf_key`', { clientVersion: '5.14.0', code: 'P2002' });

      jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(prismaError);

      const userToBeCreated: CreateUserDto = {
        email: fakeUsers[0].email,
        password: fakeUsers[0].password,
        username: fakeUsers[0].username,
        name: fakeUsers[0].name,
      };

      expect(userService.create(userToBeCreated)).rejects.toThrow(PrismaClientKnownRequestError);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });
});
