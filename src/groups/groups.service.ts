import { Injectable } from "@nestjs/common";
import { required } from "../utils";
import { models } from "heimdallts-db";
import { BaseError } from "make-error";
import { v4 as uuid } from 'uuid';

class GroupAlreadyExistsException extends BaseError {
  constructor(team_name: string) {
    super(`Team ${team_name} already exists.`);
  }
}

class GroupDoesNotExistException extends BaseError {
  constructor(team_name: string) {
    super(`Team ${team_name} does not exist.`);
  }
}

class MembershipError extends BaseError {
  constructor(msg: string) {
    super(`Membership operation failed: ${msg}`);
  }
}

@Injectable()
export class GroupsService {

  /** Creates a team with the specified name, and the specified owner. */
  async create_team(
    with_owner: models.User,
    name: string
  ): Promise<models.Usergroup> {
    // Establish our lookup
    let group_type: models.UsergroupType = "team";
    let member_type: models.MembershipType = "owner";

    // Make the team
    let group = await models.Usergroup.create({
      name,
      type: group_type
    }).catchThrow(new GroupAlreadyExistsException(name));

    // Make them the owner
    await this.join(group, with_owner, member_type);
    return group;
  }

  /** Gives a personal group name for the user. */
  personal_groupname(for_user: models.User): string {
    return `personal_${for_user.id}`;
  }

  /** Creates a unique groupname in the specified type by generating a new unique identifier.
   * These don't need to be beautiful, just unique.
   */
  async generate_adhoc_group(): Promise<models.Usergroup> {
    // Get the highest id'd element
    let most = await models.Usergroup.findOne({
      order: [["id", "DESC"]],
      type: "ad-hoc"
    });

    // Figure the next id
    let next: number;
    if (most == null) {
      next = 0;
    } else {
      next = most.id;
    }

    // Keep trying to make a new group with the id + 1;
    let new_group: models.Usergroup | null = null;
    while (new_group == null) {
      next += 1;
      new_group = await models.Usergroup.create({
        type: "ad-hoc",
        name: `ad-hoc:${next}`
      }).catchReturn(null);
    }

    return new_group;
  }

  /** Creates a personal group for the specified user, and sets them as the owner of said group */
  async create_personal_group(
    for_user: models.User
  ): Promise<models.Usergroup> {
    let name = this.personal_groupname(for_user);
    let group_type: models.UsergroupType = "personal";

    // Make the group
    let group = await models.Usergroup.create({
      type: group_type,
      name
    }).catchThrow(new GroupAlreadyExistsException(name));

    // Make the user the owner of the group
    let membership_type: models.MembershipType = "owner";
    let membership = await this.create_membership(for_user, group, membership_type);

    // Create API key for membership
    await this.create_api_key(membership, name, membership_type);
    //await this.join(group, for_user, membership_type);

    return group;
  }

  async create_membership(
    for_user: models.User,
    in_group: models.Usergroup,
    as_type: models.MembershipType
  ): Promise<models.Membership> {
    return models.Membership.create({
      user_id: for_user.id,
      usergroup_id: in_group.id,
      type: as_type
    });
  }

  async create_api_key(
    for_membership: models.Membership,
    group_name: string,
    member_type: string
  ): Promise<models.ApiKey> {
    const api_key: string = uuid();
    return models.ApiKey.create({
      key: api_key,
      membership_id: for_membership.id,
      name: group_name + " " + member_type + " key"
    });
  }

  /** Looks up the team with the given name.  */
  async get_team_by_name(name: string): Promise<models.Usergroup> {
    let group_type: models.UsergroupType = "team";
    return models.Usergroup.findOne({
      where: {
        type: group_type,
        name: name
      }
    })
      .then(required)
      .catchThrow(new GroupDoesNotExistException(name));
  }

  /** Looks up the team with the given name, but does so through a user and provides said user membership in team */
  async get_team_by_name_by_user(
    name: string,
    for_user: models.User
  ): Promise<models.Usergroup & { Membership: models.Membership }> {
    let group_type: models.UsergroupType = "team";
    return for_user
      .$get("usergroups", {
        where: {
          type: group_type,
          name: name
        }
      })
      .then(required)
      .then(x => x[0])
      .catchThrow(new GroupDoesNotExistException(name));
  }

  /** Join the given user to the given group with the given role */
  async join(
    group: models.Usergroup,
    user: models.User,
    as_type: models.MembershipType
  ): Promise<void> {
    // Make sure not already in the group
    let membership = await models.Membership.findOne({
      where: {
        user_id: user.id,
        usergroup_id: group.id
      }
    });

    if (membership != null) {
      throw new MembershipError("Cannot join a group you are already in.");
    }

    // Check it's not adding an invalid user to an ad-hoc
    if (group.type == "ad-hoc" && as_type != "user") {
      throw new MembershipError(
        'Ad-hoc groups should only have "user" members.'
      );
    }

    // If there's already another user, we cannot join as an owner, because
    if (as_type == "owner") {
      // Check there are no existing members
      let existing_users = await group.$get("users");
      if (existing_users.find(u => u.Membership.type == "owner")) {
        throw new MembershipError(
          "Attempted to create a second owner in a group"
        );
      }
    }

    // Create the membership
    await models.Membership.create({
      user_id: user.id,
      usergroup_id: group.id,
      type: as_type
    });
  }

  /** Leave the given group.
   * Fails if the user is not in the group.
   * Fails if the user is the owner (must transfer ownership, or destroy the group outright, to perform this)
   */
  async leave(group: models.Usergroup, user: models.User): Promise<void> {
    let membership = await models.Membership.findOne({
      where: {
        user_id: user.id,
        usergroup_id: group.id
      }
    });

    if (membership === null) {
      throw new MembershipError("Cannot leave a group you're not in.");
    }

    if (membership.type == "owner") {
      throw new MembershipError(
        "Cannot leave a group that you're an owner of."
      );
    }

    // Otherwise, destroy.
    await membership.destroy();
  }

  /** Returns a list of all ad-hoc groups a user is a part of */
  async get_teams(for_user: models.User): Promise<models.Usergroup[]> {
    let group_type: models.UsergroupType = "team";

    // TODO: Test that this actually works
    return for_user.$get("usergroups", {
      where: {
        type: group_type
      }
    });
  }

  /** Returns a list of all ad-hoc groups a user is a part of */
  async get_adhoc_groups(for_user: models.User): Promise<models.Usergroup[]> {
    let group_type: models.UsergroupType = "ad-hoc";
    return for_user.$get("usergroups", {
      where: {
        type: group_type
      }
    });
  }

  /** Create an ad-hoc group for a user. */
  async create_adhoc_group(
    for_users: models.User[]
  ): Promise<models.Usergroup> {
    // Spawn the group
    let group = await this.generate_adhoc_group();

    // Add them all to it
    for (let user of for_users) {
      await this.join(group, user, "user");
    }
    return group;
  }

  /** Lists the evaluations for a group */
  async list_evaluation(
    for_group: models.Usergroup
  ): Promise<models.Evaluation[]> {
    return for_group.$get("evaluations", {
      include: [models.Tag]
    });
  }

  /** Retrieves the personal usergroup of a user */
  async get_personal_group(for_user: models.User): Promise<models.Usergroup> {
    let name = this.personal_groupname(for_user);
    let group_type: models.UsergroupType = "personal";
    return models.Usergroup.findOne({
      where: {
        type: group_type,
        name
      }
    }).then(required);
  }
}
