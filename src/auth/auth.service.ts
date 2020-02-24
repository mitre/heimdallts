import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { models } from "hdf-db-sequelize";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload, Token } from "./jwt.strategy";
import { required } from "src/utils";

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
    const auth = await this.users_service.get_user_login(username);

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

  second = 1;
  minute = 60 * this.second;
  hour = 60 * this.minute;
  day = 24 * this.hour;
  TOKEN_DURATION_SECONDS = this.minute;

  async login(user: models.User): Promise<Token> {
    const payload: TokenPayload = {
      sub: user.id,
      exp: new Date().valueOf() + this.minute
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
