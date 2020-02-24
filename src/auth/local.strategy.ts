import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { models } from "hdf-db-sequelize";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth_service: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<models.User> {
    console.log(`Validating ${username} ${password}`);
    const user = await this.auth_service.validate_user(username, password);
    if (typeof user === "string") {
      throw new UnauthorizedException();
    }
    return user;
  }
}
