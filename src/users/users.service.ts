import { Injectable } from "@nestjs/common";
import { models } from "hdf-db-sequelize";
import { compare, hash } from "bcrypt";
import { GroupsService } from "src/groups/groups.service";

export class UsernameExistsError extends Error {}

const SALT_ROUNDS = 10;
@Injectable()
export class UsersService {
  constructor(private readonly groups: GroupsService) {}

  /** Creates a new user with the given email,
   * and then creates login credentials with that email as a username,
   * and the provided password as a password */
  async register_user_localauth(
    email: string,
    password: string
  ): Promise<models.User> {
    const new_user = await this.init_new_user(email);
    await this.create_user_login(new_user, email, password);
    return new_user;
  }

  /** Creates a user with the provided information. Instantiates their usergroup and associates them. Returns the new user
   *
   * @param email The email address to use for the user
   */
  async init_new_user(email: string): Promise<models.User> {
    // Make the user
    const user = await models.User.create({
      /** The contact email of the user. We default this to the provided email */
      contactEmail: email
    });

    // Make their user group
    await this.groups.create_personal_group(user);

    // Return the user
    return user;
  }

  /** Initializes a new user/password pair for the given user, with the given credentials */
  async create_user_login(
    for_user: models.User,
    username: string,
    password: string
  ): Promise<models.AuthUserPass> {
    // Check: is user available?
    if (
      await models.AuthUserPass.findOne({
        where: {
          username
        }
      })
    ) {
      console.warn("Attempted to create duplicate user ");
      throw new UsernameExistsError();
    }

    // Encrypt the password
    const encrypted_password = await UsersService.salt_and_hash(password);

    // Make the auth
    const auth = await models.AuthUserPass.create({
      username,
      /** The password, salted and hashed */
      encrypted_password,
      /** Whether this user/pass has been disabled, either manually or via password reset. */
      disabled: false,
      /** When, if ever, this password will expire natrually */
      expiration: null,

      user_id: for_user.id
    });
    return auth;
  }

  async get_user_login(username: string): Promise<models.AuthUserPass | null> {
    // Look up most recent user/password with this username
    return models.AuthUserPass.findOne({
      where: {
        username: username
      },
      order: [["createdAt", "DESC"]] // we only want the most recent
    });
  }

  /** Returns the latest auth item for the specified user, iff that item is not expired or disabled.
   *
   * @param user The user to query
   */
  async get_current_auth_user_pass(
    user: models.User
  ): Promise<models.AuthUserPass | null> {
    const auths = await user.$get("auth_user_pass", {
      order: ["createdAt", "desc"]
    });

    if (auths.length) {
      const relevant = auths[0];
      // Check expired/disabled. Note we can't do this in a where clause else we might get old data
      if (UsersService.check_expired(relevant) || relevant.disabled) {
        return null;
      }
      return relevant;
    } else {
      // No auths found!
      return null;
    }
  }

  /** Checks if the given authorization item has expired - true indicates expired
   *
   * @param auth The authorization item to check
   */
  static check_expired(auth: models.AuthUserPass): boolean {
    if (!auth.expiration) {
      return false;
    }
    return auth.expiration.valueOf() < new Date().valueOf();
  }

  /** Returns true iff passwords match, after salting and hashing
   *
   * @param raw_password The newly submitted password
   * @param target_hashed The salted and hashed password recalled from the db
   */
  static async check_password(
    raw_password: string,
    target_hashed: string
  ): Promise<boolean> {
    return compare(raw_password, target_hashed);
  }

  /** Wraps bcrypt salt/hash functionality
   *
   * @param password The password to salt/hash
   */
  static async salt_and_hash(password: string): Promise<string> {
    const salted_and_hashed = await hash(password, SALT_ROUNDS);
    return salted_and_hashed;
  }
}
