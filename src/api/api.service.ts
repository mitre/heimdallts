import {
  Injectable,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { required } from "../utils";
import { models } from "heimdallts-db";
import { Request } from "express";

// eslint-disable-next-line
// @ts-ignore
const crypt: any = require("crypto-random-string"); // eslint-disable-line 
 
// cryptoRandomString({length: 10});
// import { Promise } from "bluebird";

@Injectable()
export class ApiService {
  /** This validates an api call, using an email-key combo.
   * The group from which the key was derived determines the group that we respond with.
   *
   * Requires an email and an api key. On successful authentication, responds with the user and their personal usergroup
   */
  async check_user(req: Request): Promise<models.Membership> {
    // Get credentials
    const email: string | undefined = req.body.email;
    const key: string | undefined = req.body.api_key;

    // Validate that they were provided
    if (!email) {
      throw new BadRequestException("Missing required field 'email'");
    }
    if (!key) {
      throw new BadRequestException("Missing required field 'key'");
    }

    // Fetch the key
    const db_key = await models.ApiKey.findOne({
      where: {
        key: key
      }
    })
      .then(required)
      .catchThrow(new UnauthorizedException("Invalid key"));


    // Check the expiration
    if (db_key.expiration && db_key.expiration < new Date()) {
      throw new UnauthorizedException("Expired key");
    }

    // Fetch corresponding membership
    const db_key_membership = (await db_key.$get("membership"))!;

    // Deduce which user the key ;points to
    const db_key_user = await db_key_membership.$get("user");

    // Check that our discovered users email matches
    if (db_key_user?.email !== email) {
      throw new UnauthorizedException("Invalid key");
    }

    // Attach the user
    return db_key_membership;
  }

  /** Creates a new API key for a membership, removing the old one.
   * 
   * @param for_membership The membership to which to bind the key
   * @param expiration When this new key should naturally expire, if ever
   */
  async regenerate_key(for_membership: models.Membership, expiration: Date | null): Promise<models.ApiKey> {
    // Generate a key
    // crypt
    let key: string;
    let existing: models.ApiKey | null | "n/a" = "n/a";

    // Loop to guarantee uniqueness
    key = crypt({length: 128});
    while (existing !== null) {
      key = crypt({length: 128});
      existing = await models.ApiKey.findOne({where: {key}});
    }

    // Know key is unique from here
    return models.ApiKey.create({
      expiration,
      key
     });
  }
}
