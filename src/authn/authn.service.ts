import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { models } from "heimdallts-db";
import { JwtService } from "@nestjs/jwt";
import { Token } from "./jwt.strategy";
import { required } from "../utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly users_service: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validate_user(
    username: string,
    password: string
  ): Promise<
    models.User | "not_found" | "expired" | "disabled" | "bad_password"
  > {
    const auth = await this.users_service.get_login_by_username(username);

    // Check basic invalidity conditions
    if (!auth) {
      return "not_found";
    }

    if (auth.disabled) {
      return "disabled";
    }

    if (UsersService.check_expired(auth)) {
      return "expired";
    }

    // Check password
    if (
      !(await UsersService.check_password(password, auth.encrypted_password))
    ) {
      return "bad_password";
    }

    return auth.$get("user").then(required);
  }

  async login(user: models.User, ip: string): Promise<Token> {
    // Create a session marker for it
    await models.Session.create({
      user_id: user.id,
      ip,
      key: "TBD"
    });

    // Create our payload
    const payload = {
      sub: user.id
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
