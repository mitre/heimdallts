import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JWT_CONSTANTS } from "./constants";
import { models } from "hdf-db-sequelize";

/** Produced when signing a JWT token */
export interface Token {
  /** The encoded content of the JWT token */
  access_token: string;
}

/** Stored in the JWT token
 * See below for more field options
 * https://tools.ietf.org/html/rfc7519#section-4.1
 */
export interface TokenPayload {
  /** Subject - in this case, the user id */
  sub: number;

  /** Expiration time, in seconds since 1970 */
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret
    });
  }

  async validate(payload: TokenPayload): Promise<models.User> {
    /** It's expired! */
    if (new Date().valueOf() > payload.exp) {
      throw new UnauthorizedException("TOKEN_EXPIRED");
    }
    const user = await models.User.findByPk(payload.sub);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException("USER_DOES_NOT_EXIST");
    }
  }
}
