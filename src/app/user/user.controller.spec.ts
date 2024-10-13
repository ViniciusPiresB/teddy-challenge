import { Status, User } from '@prisma/client';
import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';

describe('UserController', () => {
  let userController: UserController;

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

  const fakeJwtPayload: JwtPayload = {
    id: Date.now().toString(),
    email: fakeUsers[0].email,
    username: fakeUsers[0].username,
    name: fakeUsers[0].name,
    status: fakeUsers[0].status,
    typeUser: 1,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    deletedAt: null,
    iat: Date.now(),
  };

  const userServiceMock = {
    create: jest.fn(userCreateDTO => {
      return { id: Date.now(), ...userCreateDTO };
    }),
    findByEmail: jest.fn(email => {
      return { ...fakeUsers[0], email };
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete: jest.fn(email => {
      return { ...fakeUsers[0], status: Status.DELETED, deletedAt: new Date() };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    userServiceMock.create.mockClear();
    userServiceMock.findByEmail.mockClear();
    userServiceMock.delete.mockClear();
  });

  it('Should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('Should call create user', async () => {
      const fakeUserCreateDTO: CreateUserDto = { ...fakeUsers[0] };

      const result = await userController.create(fakeUserCreateDTO);

      expect(result).toEqual({ id: expect.any(String), ...fakeUserCreateDTO });
      expect(userServiceMock.create).toHaveBeenCalledWith(fakeUserCreateDTO);
      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('Should call findByEmail', async () => {
      const { email } = fakeUsers[0];

      const result = await userController.findByEmail(email);

      expect(result).toEqual({ ...fakeUsers[0], email });
      expect(userServiceMock.findByEmail).toHaveBeenCalledWith(email);
      expect(userServiceMock.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('Should call delete', async () => {
      const result = await userController.deleteAccount(fakeJwtPayload);

      expect(result).toStrictEqual({ ...fakeUsers[0], status: Status.DELETED, deletedAt: expect.any(Date) });
      expect(userServiceMock.delete).toHaveBeenCalled();
    });
  });
});
