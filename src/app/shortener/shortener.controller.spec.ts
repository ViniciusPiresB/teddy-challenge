/* eslint-disable @typescript-eslint/no-unused-vars */
import { ShortUrls, Status } from '@prisma/client';
import { ShortenerController } from './shortener.controller';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';
import { UpdateShortDto } from './dto/update-short.dto';

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;

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

  const shortenerServiceMock = {
    createShortUrl: jest.fn((longUrl: string, user: JwtPayload) => {
      return { ...fakeShortUrlsFromUser[0], longUrl };
    }),
    listUrlsOfUser: jest.fn(user => {
      return fakeShortUrlsFromUser.filter(url => url.userId === user.id);
    }),
    updateLongUrl: jest.fn((user, shortUrl, newLongUrl) => {
      return { ...fakeShortUrlsFromUser[0], longUrl: newLongUrl };
    }),
    deleteUrl: jest.fn(() => {
      return { ...fakeShortUrlsFromUser[0], status: Status.DELETED, deletedAt: new Date() };
    }),
    findLongUrl: jest.fn(shortUrl => {
      return fakeShortUrlsFromUser.find(url => url.shortUrl === shortUrl);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [{ provide: ShortenerService, useValue: shortenerServiceMock }],
    }).compile();

    shortenerController = module.get<ShortenerController>(ShortenerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(shortenerController).toBeDefined();
  });

  describe('create', () => {
    it('Should create a short URL', async () => {
      const createShortDto: CreateShortDto = { url: 'http://example.com' };

      const result = await shortenerController.create(createShortDto, fakeUser);

      expect(result).toEqual({ ...fakeShortUrlsFromUser[0], longUrl: createShortDto.url });
      expect(shortenerServiceMock.createShortUrl).toHaveBeenCalledWith(createShortDto.url, fakeUser);
      expect(shortenerServiceMock.createShortUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('listUrlsOfUser', () => {
    it('Should return list of URLs for the user', async () => {
      const result = await shortenerController.listUrlsOfUser(fakeUser);

      expect(result).toEqual(fakeShortUrlsFromUser.filter(url => url.userId === fakeUser.id));
      expect(shortenerServiceMock.listUrlsOfUser).toHaveBeenCalledWith(fakeUser);
      expect(shortenerServiceMock.listUrlsOfUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLongUrl', () => {
    it('Should update the long URL for a given short URL', async () => {
      const updateShortDto: UpdateShortDto = { longUrl: 'http://updated.com' };

      const result = await shortenerController.updateLongUrl(fakeShortUrlsFromUser[0].shortUrl, fakeUser, updateShortDto);

      expect(result).toEqual({ ...fakeShortUrlsFromUser[0], longUrl: updateShortDto.longUrl });
      expect(shortenerServiceMock.updateLongUrl).toHaveBeenCalledWith(fakeUser, fakeShortUrlsFromUser[0].shortUrl, updateShortDto.longUrl);
      expect(shortenerServiceMock.updateLongUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUrl', () => {
    it('Should delete a short URL', async () => {
      const result = await shortenerController.deleteUrl(fakeShortUrlsFromUser[0].shortUrl, fakeUser);

      expect(result).toEqual({ ...fakeShortUrlsFromUser[0], status: Status.DELETED, deletedAt: expect.any(Date) });
      expect(shortenerServiceMock.deleteUrl).toHaveBeenCalledWith(fakeUser, fakeShortUrlsFromUser[0].shortUrl);
      expect(shortenerServiceMock.deleteUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('redirect', () => {
    it('Should redirect to the long URL', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      };

      await shortenerController.redirect(fakeShortUrlsFromUser[0].shortUrl, mockResponse);

      expect(shortenerServiceMock.findLongUrl).toHaveBeenCalledWith(fakeShortUrlsFromUser[0].shortUrl);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.redirect).toHaveBeenCalledWith(fakeShortUrlsFromUser[0]);
    });
  });
});
