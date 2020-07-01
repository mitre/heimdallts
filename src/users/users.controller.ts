import { Controller, Req, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { models } from "heimdallts-db";
import { UsersService } from "../users/users.service";
import { ReqWithUser } from "../authn/authn.controller";

@Controller("users")
export class UsersController {
  constructor(
    private readonly users: UsersService
  ) {}

  //curl -X GET http://localhost:8050/users
  @Get()
  async all_users(): Promise<models.User[]> {
    return this.users.get_users();
  }

}
