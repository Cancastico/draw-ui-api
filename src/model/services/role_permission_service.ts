import { RolePermission } from "../../../prisma/databases/main";
import { prisma } from "../../prisma";
import { error_response } from "./error_service";

export class role_permission_service {
  async create(role_permission: RolePermission) {
    try {
      const role = prisma.role.findUnique({
        where: { id: role_permission.roleId },
      });
      const permission = prisma.permission.findUnique({
        where: { id: role_permission.permissionId },
      });
      const [roleExist, permissionExist] = await Promise.all([
        role,
        permission,
      ]);

      if (!roleExist) throw new error_response(404, "Role not found");
      if (!permissionExist)
        throw new error_response(404, "Permission not found");

      const created = await prisma.rolePermission.create({
        data: role_permission,
      });

      return created;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async delete(role_permission: RolePermission) {
    try {
      try {
        await prisma.rolePermission.findUniqueOrThrow({
          where: { roleId_permissionId: role_permission },
        });
      } catch (error: any) {
        throw new error_response(404, "RolePermission Not Found");
      }

      await prisma.rolePermission.delete({
        where: { roleId_permissionId: role_permission },
      });
      return true;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
}
