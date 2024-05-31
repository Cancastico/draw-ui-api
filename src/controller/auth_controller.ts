import { Request, Response } from "express";
import { error_response } from "../model/services/error_service";
import { User } from "../../prisma/databases/main";
import { user_service } from "../model/services/user_service";
import * as bcrypt from "bcryptjs";
import { token_service } from "../model/services/token_service";
import { user_role_service } from "../model/services/user_role_service";
import { ILogin } from "../model/models/login.model";

export class auth_controller {
  async login(req: Request, res: Response) {
    try {
      const { login, password }: ILogin = req.body;

      let user;
      if (login.includes("@")) {
        user = await user_service.find_email(login);
      } else {
        user = await user_service.find_username(login);
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new error_response(401, "Invalid Credentials");
      }
      const access_token = await token_service.generate_tokens(user);

      return res.status(200).json({ access_token });
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, username }: Omit<User, "id"> = req.body;

      const user = await user_service.create({
        email,
        password,
        name,
        username,
      });

      const user_role = await user_role_service.create({
        userId: user.id,
        roleId: 2,
      });

      const access_token = await token_service.generate_tokens({
        ...user,
        roles: [user_role],
      });

      return res.status(201).json({ access_token });
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
}
