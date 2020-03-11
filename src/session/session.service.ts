import { Injectable } from "@nestjs/common";
import { models } from "heimdallts-db";

export class SessionDoesNotExistError extends Error {}

@Injectable()
export class SessionService {
  /** Initializes a session for the given user.
   */
  async init_session(for_user: models.User): Promise<models.Session> {
    const session = await models.Session.create({});
    throw new Error("Not implemented");
  }
}
