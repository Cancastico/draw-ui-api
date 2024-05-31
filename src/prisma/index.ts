/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '../../prisma/databases/main';

export const prisma = new PrismaClient();
