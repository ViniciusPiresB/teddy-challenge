import { Status } from '@prisma/client';

export type JwtPayload = {
  id: string;
  email: string;
  username: string;
  name: string;
  status: Status;
  typeUser: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  iat: number;
};
