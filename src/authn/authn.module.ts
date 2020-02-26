import { Module } from "@nestjs/common";
import { AuthService } from "./authn.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONSTANTS } from "./constants";
import { JwtStrategy, SIGN_TIME } from "./jwt.strategy";
import { AuthController } from "./authn.controller";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: SIGN_TIME }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
