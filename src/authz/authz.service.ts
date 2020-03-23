import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthorizationService {
  constructor(private readonly users_service: UsersService) {}

  //async check_access
}
