import {
  Controller,
  Req,
  Get,
  Post,
  UseGuards,
  Body,
  UsePipes
} from "@nestjs/common";

import { models } from "hdf-db-sequelize";
import { Token } from "src/authn/jwt.strategy";
import { JwtAuthGuard } from "src/authn/jwt.authn-guard";
import { LocalAuthGuard } from "src/authn/local.authn-guard";
import { UsersService } from "../users/users.service";
import { AuthService } from "src/authn/authn.service";
import { Request } from "express";
import { IsString } from "class-validator";
import { SchemaValidationPipe } from "src/validation/schema.pipe";
import { AuthGuard } from "@nestjs/passport";

export interface ReqWithUser extends Request {
  user: models.User;
}

/** The body of a registration Request */
class RegisterDTO {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly user_service: UsersService,
    private readonly auth_service: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login_user_pass(@Req() req: ReqWithUser): Promise<Token> {
    return this.auth_service.login(req.user, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: ReqWithUser): models.User {
    return req.user;
  }

  @Post("register")
  async register(
    @Body(new SchemaValidationPipe()) register_dto: RegisterDTO
  ): Promise<string> {
    await this.user_service.register_user_localauth(
      register_dto.email,
      register_dto.password
    );
    return "ok";
  }
}