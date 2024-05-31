import { Prisma, RefreshToken, User } from "../../../prisma/databases/main";
import { prisma } from "../../prisma";
import { error_response } from "./error_service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { access_token } from "../models/token.model";

export class token_service {
  static async generate_tokens(
    user: Prisma.UserGetPayload<{ include: { roles: true } }>,
  ) {
    try {
      const refresh = await this.generate_refresh_token(user);
      const access = await this.generate_access_token(refresh);
      return access;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async generate_refresh_token(
    user: Omit<Prisma.UserGetPayload<{ include: { roles: true } }>, "password">,
  ) {
    try {
      await this.revoke_refresh_token(user.id);

      const SECRET = process.env.SECRET_JWT;

      if (!SECRET) throw new Error("Secret JWT not defined");

      const refresh = jwt.sign(
        { ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 },
        SECRET,
      );

      const hashed_token = bcrypt.genSaltSync(12);

      const created = await prisma.refreshToken.create({
        data: {
          idUser: user.id,
          token: bcrypt.hashSync(refresh, hashed_token),
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

  static async generate_access_token(refresh_token: RefreshToken) {
    try {
      const SECRET = process.env.ACCESS_TOKEN;

      if (!SECRET) throw new Error("Secret JWT not defined");

      const access = jwt.sign(
        { id_refresh: refresh_token.id, id_user: refresh_token.idUser },
        SECRET,
        { expiresIn: "1h", algorithm: "HS256" },
      );

      return access;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }

  static async validate_renew_token(access_token: string) {
    try {
      const SECRET = process.env.ACCESS_TOKEN;

      if (!SECRET) throw new Error("Secret JWT not defined");

      let token_decoded;

      try {
        token_decoded = jwt.verify(access_token, SECRET, {
          ignoreExpiration: true,
        }) as access_token;
      } catch (error: any) {
        throw new error_response(400, error.message ?? "Token decode failed");
      }

      let refresh: Prisma.RefreshTokenGetPayload<{}>;
      try {
        refresh = await prisma.refreshToken.findUniqueOrThrow({
          where: { id: token_decoded.id_refresh },
        });
      } catch (error: any) {
        throw new error_response(404, "Token Not Found");
      }

      const new_access_token = await this.generate_access_token(refresh);

      return new_access_token;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server Error",
      );
    }
  }
  static async revoke_refresh_token(id_user: number) {
    try {
      await prisma.refreshToken.updateMany({
        where: { idUser: id_user },
        data: { revoked: true },
      });
      return true;
    } catch (error: any) {
      throw new error_response(
        error.code ?? 500,
        error.message ?? "Internal Server error",
      );
    }
  }
}
