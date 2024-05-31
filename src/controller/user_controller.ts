import { Request, Response } from "express";
import { error_response } from "../model/services/error_service";
import { User } from "../../prisma/databases/main";
import { user_service } from "../model/services/user_service";
import { token_service } from "../model/services/token_service";
import { user_role_service } from "../model/services/user_role_service";

export class user_controller {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, username }: Omit<User, "id"> = req.body;

      if (!name) {
        throw new error_response(400, "Name Is Required");
      }
      if (!email) {
        throw new error_response(400, "Email Is Required");
      }
      if (!password) {
        throw new error_response(400, "Password Is Required");
      }
      if (!username) {
        throw new error_response(400, "Password Is Required");
      }

      const created: User = await user_service.create({
        name,
        email,
        password,
        username,
      });

      const role = await user_role_service.create({
        userId: created.id,
        roleId: 1,
      });

      const access_token = await token_service.generate_tokens({
        ...created,
        roles: [role],
      });

      return res.status(201);
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async get(req: Request, res: Response) {
    try {
      const users = await user_service.find();

      return res.status(200).json(users);
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async get_email(req: Request, res: Response) {
    try {
      const { email }: Pick<User, "email"> = req.body;

      const user = await user_service.find_email(email);

      return res.status(200).json(user);
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async update(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        email,
      }: Omit<Partial<User>, "id" | "password"> & { id: number } = req.body;

      const user_updated = await user_service.update({ id, name, email });

      return res.status(200).json(user_updated);
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new error_response(400, "Id is Invalid");
      }

      await user_service.delete(id);

      return res.status(200);
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
}
