import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { models } from "hdf-db-sequelize";
import { required } from "src/utils";
import { Request } from "express";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // if (!roles) {
    // return true;
    // }
    // Get request
    const req = context.switchToHttp().getRequest() as Request;

    // Get params
    // const username = req.header("email");
    // const key = req.header("api_key");
    console.log(req.body);
    const username = req.params.email;
    const key = req.params.api_key;
    console.log(req);
    console.log(req.params);
    console.log(username);
    console.log(key);

    // Try to lookup up user by api-key
    const email_suspected_user = await models.AuthUserPass.findOne({
      where: {
        username: username
      }
    })
      .then(required)
      .then(usr => usr.$get("user"))
      .then(required)
      .catchThrow(new UnauthorizedException("Username not recognized"));

    const key_suspected_user = await models.ApiKey.findOne({
      where: {
        key: key
      }
    })
      .then(required)
      .then(key => key.$get("user"))
      .then(required)
      .catchThrow(new UnauthorizedException("Invalid key"));

    // check users are the same
    if (email_suspected_user.id !== key_suspected_user.id) {
      throw new UnauthorizedException("Invalid key");
    }

    // Attach the user
    req.user = email_suspected_user; // Key'd be they same since they've both got the same id
    return true;
  }
}
