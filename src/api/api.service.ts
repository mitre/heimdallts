import {
  Injectable,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { required } from "../utils";
import { models } from "heimdallts-db";
import { Request } from "express";
// import { Promise } from "bluebird";

@Injectable()
export class ApiService {
  /** This validates an api call, using an email-key combo.
   * The group from which the key was derived determines the group that we respond with.
   *
   * Requires an email and an api key. On successful authentication, responds with the user and their personal usergroup
   */
  async check_user(req: Request): Promise<[models.User, models.Usergroup]> {
    // Get credentials
    const email: string | undefined = req.body.email;
    const key: string | undefined = req.body.api_key;

    console.log("email: " + email);
    console.log("key: " + key);

    if (!email) {
      throw new BadRequestException("Missing required field 'email'");
    }
    if (!key) {
      throw new BadRequestException("Missing required field 'key'");
    }

    // Try to lookup up user by email
    const db_user = await models.User.findOne({
      where: {
        email: email
      }
    })
      .then(required)
      .catchThrow(new UnauthorizedException("Email not recognized"));

    // Fetch the key
    const db_key = await models.ApiKey.findOne({
      where: {
        key: key
      }
    })
      .then(required)
      .catchThrow(new UnauthorizedException("Invalid key"));

    // Fetch corresponding membership
    const db_key_membership = (await db_key.$get("membership"))!;
    console.log("db_key_membership: " + JSON.stringify(db_key_membership));
    console.log("db_key_user_id: " + db_key_membership.user_id);

    // Deduce which user the key ;points to
    const db_key_user_id = db_key_membership.user_id;
    console.log("db_key_user_id: " + db_key_user_id);
    console.log("db_user.id: " + db_user.id);

    // Check that our discovered users are the same
    if (db_key_user_id !== db_user.id) {
      throw new UnauthorizedException("Invalid key");
    }

    // Having done that, retrieve the db keys group.
    const db_key_group = (await db_key_membership.$get("usergroup"))!;

    // Attach the user
    return [db_user, db_key_group];
  }
}
