import { Status, User } from '@prisma/client';
import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

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
});
