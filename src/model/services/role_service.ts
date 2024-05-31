import { Role } from "../../../prisma/databases/main";
import { prisma } from "../../prisma";
import { error_response } from "./error_service";

export class role_service {
  static async create(role: Omit<Role, "id">) {
    try {
      const created = await prisma.role.create({ data: role });

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
      const roles = await prisma.role.findMany();
      return roles;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  static async find_id(id: number) {
    try {
      const roles = await prisma.role.findUniqueOrThrow({
        where: { id },
        include: { permissions: true, users: true },
      });
      return roles;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async update(role: Role) {
    try {
      const updated = await prisma.role.update({
        where: { id: role.id },
        data: role,
      });
      return updated;
    } catch (error: any) {
      throw new error_response(400, error.message ?? "Internal Server Error");
    }
  }

  static async delete(id: number) {
    try {
      try {
        await prisma.role.findUniqueOrThrow({ where: { id } });
      } catch (error: any) {
        throw new error_response(404, "Role Note Found");
      }
      await prisma.role.delete({ where: { id } });
      return true;
    } catch (error: any) {
      throw new error_response(400, error.message ?? "Internal Server Error");
    }
  }
}
