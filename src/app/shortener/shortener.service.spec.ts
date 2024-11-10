import { PrismaService } from '../../database/prisma.service';
import { ShortenerService } from './shortener.service';
import { ShortUrls, Status } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import * as nanoid from 'nanoid';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ShortenerModule } from './shortener.module';

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
      findUnique: jest.fn().mockResolvedValue(fakeShortUrlsFromUser[0]),
      findMany: jest.fn().mockResolvedValue(fakeShortUrlsFromUser),
      update: jest.fn().mockResolvedValue({
        ...fakeShortUrlsFromUser[0],
        longUrl: 'http://newlong.url',
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 300000, max: 100 }), ShortenerModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

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

  describe('listUrlsOfUser', () => {
    it('Should return the list of URLs for a given user', async () => {
      const result = await shortenerService.listUrlsOfUser(fakeUser);

      expect(result).toEqual(fakeShortUrlsFromUser);
      expect(prismaService.shortUrls.findMany).toHaveBeenCalledWith({
        where: {
          userId: fakeUser.id,
          status: Status.ACTIVE,
        },
      });
      expect(prismaService.shortUrls.findMany).toHaveBeenCalledTimes(1);
    });

    it('Should throw BadRequestException if user is not provided', async () => {
      await expect(shortenerService.listUrlsOfUser(null)).rejects.toThrow(new BadRequestException('User not provided.'));
    });
  });

  describe('updateLongUrl', () => {
    const shortUrl = fakeShortUrlsFromUser[0].shortUrl;

    it('Should update the long URL successfully', async () => {
      const newLongUrl = 'http://newlong.url';

      const result = await shortenerService.updateLongUrl(fakeUser, shortUrl, newLongUrl);

      expect(result).toEqual({
        ...fakeShortUrlsFromUser[0],
        longUrl: newLongUrl,
      });
      expect(prismaService.shortUrls.update).toHaveBeenCalledWith({
        where: { shortUrl },
        data: { longUrl: newLongUrl },
      });
      expect(prismaService.shortUrls.update).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't throw BadRequestException if user is not provided", async () => {
      await expect(shortenerService.updateLongUrl(null, shortUrl, 'http://newlong.url')).rejects.toThrow(new BadRequestException('User not provided.'));
    });

    it("Shouldn't get a url that is not yours", async () => {
      const anotherUser: JwtPayload = { ...fakeUser, id: 'different-user-id' };

      await expect(shortenerService.updateLongUrl(anotherUser, shortUrl, 'http://newlong.url')).rejects.toThrow(new UnauthorizedException("This URL isn't from this user!"));
    });
  });

  describe('findLongUrl', () => {
    it('Should retrieve the long URL and increment the click count', async () => {
      const shortUrl = fakeShortUrlsFromUser[0].shortUrl;

      prismaService.shortUrls.update = jest.fn().mockResolvedValueOnce({
        ...fakeShortUrlsFromUser[0],
        click: fakeShortUrlsFromUser[0].click + 1,
      });

      const result = await shortenerService.findLongUrl(shortUrl);

      expect(result).toStrictEqual(fakeShortUrlsFromUser[0].longUrl);
      expect(prismaService.shortUrls.update).toHaveBeenCalledWith({
        where: { shortUrl: fakeShortUrlsFromUser[0].shortUrl },
        data: {
          click: {
            increment: 1,
          },
        },
      });
      expect(prismaService.shortUrls.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('Should delete the URL for logged user', async () => {
      const { shortUrl } = fakeShortUrlsFromUser[0];
      const deletedAt = new Date().toISOString();

      prismaService.shortUrls.update = jest.fn().mockResolvedValueOnce({
        ...fakeShortUrlsFromUser[0],
        deletedAt,
        status: Status.DELETED,
      });

      const result = await shortenerService.deleteUrl(fakeUser, shortUrl);

      expect(result).toEqual({
        ...fakeShortUrlsFromUser[0],
        deletedAt,
        status: Status.DELETED,
      });
      expect(prismaService.shortUrls.update).toHaveBeenCalledWith({
        where: fakeShortUrlsFromUser[0],
        data: {
          deletedAt: expect.any(String),
          status: Status.DELETED,
        },
      });

      expect(prismaService.shortUrls.update).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't delete a URL from another user", async () => {
      const fakeShortUrlFromAnotherUser = {
        ...fakeShortUrlsFromUser[0],
        userId: new Date().toISOString(),
      };

      jest.spyOn(prismaService.shortUrls, 'findUnique').mockResolvedValueOnce(fakeShortUrlFromAnotherUser);

      await expect(shortenerService.deleteUrl(fakeUser, fakeShortUrlsFromUser[0].shortUrl)).rejects.toThrow(UnauthorizedException);
    });

    it("Shouldn't delete a URL if there's no user", async () => {
      await expect(shortenerService.deleteUrl(null, fakeShortUrlsFromUser[0].shortUrl)).rejects.toThrow(BadRequestException);
      expect(prismaService.shortUrls.update).not.toHaveBeenCalled();
    });
  });
});
