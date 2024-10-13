import { PrismaService } from '../../database/prisma.service';
import { ShortenerService } from './shortener.service';
import { ShortUrls, Status } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import * as nanoid from 'nanoid';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

describe('ShortenerService', () => {
  let shortenerService: ShortenerService;
  let prismaService: PrismaService;

  const fakeUser: JwtPayload = {
    name: 'Test User 1',
    id: 'a3718843-5456-4482-9c97-a20f78cbd44e',
    email: 'test@user.com',
    username: 'testuser1',
    typeUser: 1,
    status: Status.ACTIVE,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    deletedAt: null,
    iat: Date.now(),
  };

  const fakeShortUrlsFromUser: ShortUrls[] = [
    {
      id: new Date().toISOString(),
      longUrl: 'http://long.url',
      shortUrl: '123abc',
      click: 0,
      status: Status.ACTIVE,
      userId: fakeUser.id,
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: new Date().toISOString(),
      longUrl: 'http://long.url',
      shortUrl: '456def',
      click: 0,
      status: Status.ACTIVE,
      userId: fakeUser.id,
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const prismaMock = {
    shortUrls: {
      create: jest.fn().mockResolvedValue(fakeShortUrlsFromUser[0]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortenerService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    shortenerService = module.get<ShortenerService>(ShortenerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(shortenerService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('Should create a short URL successfully with logged user', async () => {
      const longUrl = 'http://example.com';
      (nanoid.nanoid as jest.Mock).mockReturnValueOnce(fakeShortUrlsFromUser[0].shortUrl);

      const result = await shortenerService.createShortUrl(longUrl, fakeUser);

      expect(result).toEqual({
        shortenedUrl: `${process.env.BASE_URL}/${fakeShortUrlsFromUser[0].shortUrl}`,
      });
      expect(prismaService.shortUrls.create).toHaveBeenCalledWith({
        data: {
          longUrl,
          shortUrl: fakeShortUrlsFromUser[0].shortUrl,
          userId: fakeUser.id,
        },
      });
      expect(prismaService.shortUrls.create).toHaveBeenCalledTimes(1);
    });

    it('Should create a short URL without userId when user is not provided', async () => {
      const longUrl = 'http://example.com';
      (nanoid.nanoid as jest.Mock).mockReturnValueOnce(fakeShortUrlsFromUser[0].shortUrl);

      const result = await shortenerService.createShortUrl(longUrl, null);

      expect(result).toEqual({
        shortenedUrl: `${process.env.BASE_URL}/${fakeShortUrlsFromUser[0].shortUrl}`,
      });
      expect(prismaService.shortUrls.create).toHaveBeenCalledWith({
        data: {
          longUrl,
          shortUrl: fakeShortUrlsFromUser[0].shortUrl,
          userId: undefined,
        },
      });
      expect(prismaService.shortUrls.create).toHaveBeenCalledTimes(1);
    });
  });
});
