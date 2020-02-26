import { Injectable } from "@nestjs/common";
import { models } from "hdf-db-sequelize";

export class SessionDoesNotExistError extends Error {}

@Injectable()
export class SessionService {
  /** Initializes a session for the given user.
   * Note that we track sessions in the DB - this is not strictly necessary but has the convenient side effect
   * of making this server easily instanced, and stateless. Note that we could alternately just store these locally,
   * in order to reduce DB overhead, but for the time being this will be fine.
   */
  async init_session(for_user: models.User): Promise<models.Session> {
    const session = await models.Session.create({});
    throw new Error("Not implemented");
  }
}
