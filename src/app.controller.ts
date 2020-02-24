import { AppService } from "./app.service";
import { Controller, Get, Req, Post, UseGuards, Param } from "@nestjs/common";
import { Request } from "express";

import { AuthGuard } from "@nestjs/passport";
import { models } from "hdf-db-sequelize";
import { AuthService } from "./auth/auth.service";
import { Token } from "./auth/jwt.strategy";
import { UsersService } from "./users/users.service";
import { JwtAuthGuard } from "./auth/jwt.authguard";
import { LocalAuthGuard } from "./auth/local.authguard";

@Controller()
export class AppController {
  constructor(
    private readonly app_service: AppService,
    private readonly user_service: UsersService,
    private readonly auth_service: AuthService
  ) {}

  @Get()
  index(): string {
    return this.app_service.get_index();
  }

}
