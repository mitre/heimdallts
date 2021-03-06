import { Controller, Req, Get, Post, UseGuards, Body } from "@nestjs/common";

import { models } from "heimdallts-db";
import { Token } from "../authn/jwt.strategy";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { LocalAuthGuard } from "../authn/local.authn-guard";
import { UsersService } from "../users/users.service";
import { AuthService } from "../authn/authn.service";
//import { GroupsService } from "../groups/groups.service";

import { Request } from "express";
import { IsString } from "class-validator";
import { SchemaValidationPipe } from "../validation/schema.pipe";

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

/*
class ProfileDTO {
  id!: number;
  first_name!: string | null;
  last_name!: string | null;
  email!: string | null;
  image!: string | null;
  phone_number!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  //personal_group!: models.Usergroup;
  //ad_hoc_groups!: models.Usergroup[];
}
*/
@Controller("auth")
export class AuthController {
  constructor(
    private readonly user_service: UsersService,
    private readonly auth_service: AuthService //private readonly groups: GroupsService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login_user_pass(@Req() req: ReqWithUser): Promise<Token> {
    return this.auth_service.login(req.user, req.ip);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: ReqWithUser): Promise<models.User> {
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
