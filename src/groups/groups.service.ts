import { Injectable } from "@nestjs/common";
import { required } from "../utils";
import { models } from "heimdallts-db";
import { BaseError } from "make-error";

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
    await models.Membership.create({
      user_id: with_owner.id,
      usergroup_id: group.id,
      type: member_type
    });
    return group;
  }

  /** Gives a personal group name for the user. */
  personal_groupname(for_user: models.User): string {
    return `personal_${for_user.id}`;
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
    await models.Membership.create({
      user_id: for_user.id,
      usergroup_id: group.id,
      type: membership_type
    });

    return group;
  }

  /** Looksup the team with the given name.  */
  async get_team_by_name(name: string): Promise<models.Usergroup> {
    let group_type: models.UsergroupType = "team";
    return models.Usergroup.findOne({
      where: {
        type: group_type,
        name: name
      }
    }).then(required);
  }

  /** Returns a list of all ad-hoc groups a user is a part of */
  async get_adhoc_groups(for_user: models.User): Promise<models.Usergroup[]> {
    let group_type: models.UsergroupType = "ad-hoc";

    // TODO: Test that this actually works
    return for_user.$get("usergroups", {
      where: {
        type: group_type
      }
    });
  }

  /** Lists the evaluations for a group */
  async list_evaluation(
    for_group: models.Usergroup
  ): Promise<models.Evaluation[]> {
    return for_group.$get("evaluations");
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
