import { compare } from 'bcrypt';

export const validatePassword = async (password: string, passwordHash: string) => {
  return compare(password, passwordHash);
};
