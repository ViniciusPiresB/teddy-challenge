import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { Status, User } from '@prisma/client';
import { validatePassword } from '../utils/validate-password';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('../utils/validate-password');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const fakeUser: User = {
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
  };

  const mockUserService = {
    findByEmail: jest.fn().mockResolvedValue(fakeUser),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UserService, useValue: mockUserService }, { provide: JwtService, useValue: mockJwtService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validate', () => {
    const loginDto: LoginDto = {
      email: 'test@user.com',
      password: 'pass123',
    };

    it('Should return a accessToken if user is valid', async () => {
      (validatePassword as jest.Mock).mockResolvedValueOnce(true);
      mockJwtService.sign.mockReturnValueOnce('fake token');

      const result = await authService.validate(loginDto);

      expect(result).toEqual({ accessToken: 'fake token' });
    });

    it('Should throw Error if password or email is missing', async () => {
      await expect(authService.validate({ ...loginDto, password: '' })).rejects.toThrow(new BadRequestException('Missing password or email in request.'));

      await expect(authService.validate({ ...loginDto, email: '' })).rejects.toThrow(new BadRequestException('Missing password or email in request.'));
    });

    it('Should throw Error if user is not found or password invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.validate(loginDto)).rejects.toThrow(new UnauthorizedException('Email or password invalid.'));

      mockUserService.findByEmail.mockResolvedValue(fakeUser);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.validate(loginDto)).rejects.toThrow(new UnauthorizedException('Email or password invalid.'));
    });
  });
});
