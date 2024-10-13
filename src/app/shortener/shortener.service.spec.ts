import { PrismaService } from '../../database/prisma.service';
import { ShortenerService } from './shortener.service';
import { ShortUrls, Status, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

describe('ShortenerService', () => {
  let shortenerService: ShortenerService;
  let prismaService: PrismaService;

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
});
