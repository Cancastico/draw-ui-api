import { prisma } from "../../prisma";
import { User } from "./../../../prisma/databases/main/index.d";
import { error_response } from "./error_service";
import * as bcrypt from "bcryptjs";
export class user_service {
  static async create(user: Omit<User, "id">) {
    try {
      const [emailHasUsed, userHasUsed] = await Promise.all([
        prisma.user.findFirst({ where: { email: user.email } }),
        prisma.user.findFirst({ where: { username: user.username } }),
      ]);
      if (!userHasUsed) {
        throw new error_response(400, "Username has used");
      }
      if (!emailHasUsed) {
        throw new error_response(400, "Email has used");
      }

      const Salt = bcrypt.genSaltSync(12);

      const created = await prisma.user.create({
        data: {
          ...user,
          password: bcrypt.hashSync(user.password, Salt),
        },
      });

      return created;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async find() {
    try {
      const user = await prisma.user.findFirst();

      return user;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  static async find_email(email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
        include: { roles: true },
      });

      if (!user) {
        throw new error_response(400, "User not found");
      }

      return user;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async find_username(username: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { username },
        include: { roles: true },
      });

      if (!user) {
        throw new error_response(400, "User not found");
      }

      return user;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  static async update(user: Partial<Omit<User, "id">> & { id: number }) {
    try {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: user,
      });

      return updated;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  static async delete(id: number) {
    try {
      try {
        await prisma.user.findUniqueOrThrow({ where: { id } });
      } catch (error: any) {
        throw new error_response(404, "User Not Found");
      }
      const deleted = await prisma.user.delete({ where: { id: id } });

      return deleted;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
}
