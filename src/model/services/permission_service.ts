import { Permission } from "../../../prisma/databases/main";
import { prisma } from "../../prisma";
import { error_response } from "./error_service";

export class permission_service {
  async create(permission: Omit<Permission, "id">) {
    try {
      const created = await prisma.permission.create({ data: permission });
      return created;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async find() {
    try {
      const find = await prisma.permission.findMany();
      return find;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async update(permission: Permission) {
    try {
      const updated = await prisma.permission.update({
        where: { id: permission.id },
        data: permission,
      });
      return updated;
    } catch (error: any) {
      throw new error_response(400, error.message ?? "Internal Server Error");
    }
  }
  async delete(id: number) {
    try {
      try {
        await prisma.permission.findUniqueOrThrow({ where: { id } });
      } catch (error: any) {
        throw new error_response(404, "Permission Not Found");
      }

      await prisma.permission.delete({ where: { id } });

      return true;
    } catch (error: any) {
      throw new error_response(400, error.message ?? "Internal Server Error");
    }
  }
}
