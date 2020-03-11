import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { models } from "heimdallts-db";
import { required } from "../utils";

@Injectable()
export class AuthorizationService {
  constructor(private readonly users_service: UsersService) {}

  //async check_access
}
