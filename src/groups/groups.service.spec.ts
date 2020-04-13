import { Test, TestingModule } from "@nestjs/testing";
import { models } from "heimdallts-db";
import { GroupsService } from "./groups.service";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";
import { get_db } from "../db";

describe("GroupsService", () => {
  let user_service!: UsersService;
  let group_service!: GroupsService;

  let test_user_owner: models.User;
  let test_user_admin: models.User;
  let test_user_user: models.User;
  let test_user_guest: models.User;
  let all_test_users: models.User[];

  // This guy should fail all tests, and so isn't included in the above
  let test_user_fail: models.User;

  let test_team_name = "team_a";
  let test_team: models.Usergroup;

  beforeAll(async () => {
    // Ensure db initialized
    await get_db();

    // Make our services
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [GroupsService]
    }).compile();

    group_service = module.get<GroupsService>(GroupsService);
    user_service = module.get<UsersService>(UsersService);
    async function quick_user(name: string): Promise<models.User> {
      return await user_service.register_user_localauth(
        `${name}@emailer.com`,
        "doesn't matter"
      );
    }

    // Make our test users
    test_user_owner = await quick_user("owner_fella");
    test_user_admin = await quick_user("admin_buddy");
    test_user_user = await quick_user("user_pal");
    test_user_guest = await quick_user("guest_guy");
    all_test_users = [
      test_user_owner,
      test_user_admin,
      test_user_user,
      test_user_guest
    ];
    test_user_fail = await quick_user("failure_man");
  });

  it("dependencies should be defined", () => {
    expect(user_service).toBeDefined();
    expect(test_user_owner).toBeDefined();
    expect(test_user_admin).toBeDefined();
    expect(test_user_user).toBeDefined();
    expect(test_user_guest).toBeDefined();
    expect(test_user_fail).toBeDefined();
    expect(all_test_users.length).toBe(4);
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(group_service).toBeDefined();
  });

  it("should automatically create a personal usergroup for new users", async () => {
    expect.assertions(4 * all_test_users.length);
    for (let test_user of all_test_users) {
      // Ensure just the one group
      let groups = await test_user.$get("usergroups");
      expect(groups.length).toBe(1);

      // Ensure it is right type
      let t: models.UsergroupType = "personal";
      expect(groups[0].type).toBe(t);

      // Make sure membership type is correct
      let m: models.MembershipType = "owner";
      expect(groups[0].Membership.type).toBe(m);

      // Ensure nobody else is in it
      let others = await groups[0].$get("users");
      expect(others.length).toBe(1);
    }
  });

  it("should be able to create new team usergroups", async () => {
    expect.assertions(4);
    // Make a team
    test_team = await group_service.create_team(
      test_user_owner,
      test_team_name
    );

    // Make sure it is right type
    expect(test_team.type).toEqual("team");

    // Make sure it is accessible by name
    let lookup = await group_service.get_team_by_name(test_team_name);
    expect(lookup.id).toBe(test_team.id);

    // Make sure that (only) the owner has been added, as the right type
    let users = await test_team.$get("users");
    expect(users.length).toBe(1);
    expect(users[0].Membership.type).toBe("owner");
  });

  it("should be able to add users to existing teams", async () => {
    expect(test_team).toBeDefined();
    await group_service.join(test_team, test_user_admin, "admin");
    await group_service.join(test_team, test_user_user, "user");
    await group_service.join(test_team, test_user_guest, "guest");

    // Make sure they all got in
    let new_users = await test_team.$get("users");
    expect(new_users.length).toBe(4);
  });

  it("should now allow multiple owners", async () => {
    // Already have an owner, should fail
    expect(
      group_service.join(test_team, test_user_fail, "owner")
    ).rejects.toThrow();

    // Make sure nobody got added
    let new_users = await test_team.$get("users");
    expect(new_users.length).toBe(4);
  });

  it("should now allow joining twice", async () => {
    // Already in the group, should fail!
    expect(
      group_service.join(test_team, test_user_user, "user")
    ).rejects.toThrow();

    // Make sure we didn't somehow duplicate join
    let all_users = await test_team.$get("users");
    expect(all_users.length).toBe(4);
  });

  it("should now allow a group to be left owernless", async () => {
    // This would leave it ownerless
    expect(group_service.leave(test_team, test_user_owner)).rejects.toThrow();
  });

  it("should now allow leaving a group not already in", async () => {
    // Not in the group, should fail!
    expect(group_service.leave(test_team, test_user_fail)).rejects.toThrow();

    // Make sure we didn't somehow kick someone else out
    let all_users = await test_team.$get("users");
    expect(all_users.length).toBe(4);
  });

  it("should be able to remove users from existing teams", async () => {
    // Since we aren't doing any illegal joins/leaves this should work
    await group_service.leave(test_team, test_user_guest);

    // Less one
    let all_users = await test_team.$get("users");
    expect(all_users.length).toBe(3);

    // Less one - now just in the original group
    let all_groups = await test_user_guest.$get("usergroups");
    expect(all_groups.length).toBe(1);

    let all_teams = await group_service.get_teams(test_user_guest);
    expect(all_teams.length).toBe(0);

    // However, we want them back in for future tests
    await group_service.join(test_team, test_user_guest, "guest");
  });

  it("should be able to form ad-hoc groups", async () => {
    let adhoc_users = [test_user_guest, test_user_user];

    // Create the group, say between "user_user" and "gues_user"
    let grp = await group_service.create_adhoc_group(adhoc_users);

    // Ensure that they are both now in 3 groups total, and in one adhoc each
    for (let u of adhoc_users) {
      let adhoc_groups = await group_service.get_adhoc_groups(u);
      expect(adhoc_groups.length).toBe(1);

      let all_groups = await u.$get("usergroups");
      expect(all_groups.length).toBe(3);
    }

    // Let them leave
    for (let u of adhoc_users) {
      await group_service.leave(grp, u);

      // Make sure they've left
      let adhoc_groups = await group_service.get_adhoc_groups(u);
      expect(adhoc_groups.length).toBe(0);

      let all_groups = await u.$get("usergroups");
      expect(all_groups.length).toBe(2);
    }
  });

  // it("should be able to recall ad-hoc groups");
});
