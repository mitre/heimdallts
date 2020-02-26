import { AppService } from "./app.service";
import { Controller, Get, Req, Post, UseGuards, Param } from "@nestjs/common";
import { Request } from "express";

import { AuthGuard } from "@nestjs/passport";
import { models } from "hdf-db-sequelize";
import { AuthService } from "./authn/authn.service";
import { Token } from "./authn/jwt.strategy";
import { UsersService } from "./users/users.service";
import { JwtAuthGuard } from "./authn/jwt.authn-guard";

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

  /** This controller method should never be changed. Checks the validity of a connection */
  @Get("check_alive")
  check_alive(): string {
    return "HS_ALIVE";
  }
}
