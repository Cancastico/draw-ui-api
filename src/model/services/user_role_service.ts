import { UserRole } from "../../../prisma/databases/main";
import { prisma } from "../../prisma";
import { error_response } from "./error_service";

export class user_role_service {
  static async create(user_role: UserRole) {
    try {
      const created = await prisma.userRole.create({ data: user_role });
      return created;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async delete(user_role: UserRole) {
    try {
      await prisma.userRole.delete({ where: { userId_roleId: user_role } });
      return true;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
}
