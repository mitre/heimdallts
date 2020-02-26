import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { models } from "hdf-db-sequelize";
import { required } from "src/utils";

@Injectable()
export class AuthService {
  constructor(private readonly users_service: UsersService) {}

  //async check_access
}
