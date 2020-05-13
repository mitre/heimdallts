import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { GroupsModule } from "../groups/groups.module";
import { models } from "heimdallts-db";
import { get_db } from "../db";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GroupsModule],
      providers: [UsersService]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("dependencies should be defined", async done => {
    expect.assertions(2);
    expect(service).toBeDefined();
    let v = await get_db();
    expect(v).toBeDefined();
    done();
  });

  it("should be defined", () => {
    expect.assertions(1);
    expect(service).toBeDefined();
  });

  let email = "usertest_bob@dylan.com";
  let pass = "some long password 1%^$(";

  it("should successfully create a user", async () => {
    expect.assertions(1);
    // let fake_password = "for_president";
    let result = await service.init_new_user(email);
    expect(result).toBeDefined();
  });

  it("should be able to recall that user", async () => {
    expect.assertions(1);
    let user = await service.get_user_by_email(email);
    expect(user).toBeDefined();
  });

  it("should be able to give them a login", async () => {
    expect.assertions(1);
    let user = await service.get_user_by_email(email);
    let login = await service.create_user_login(user, user.email, pass);
    expect(login).toBeDefined();
  });

  it("should be able to recall their auth using email", async () => {
    expect.assertions(2);
    let login = await service.get_login_by_username(email);
    expect(login).toBeDefined();
    let user = await login.$get("user");
    expect(user!.email).toBeDefined();
  });

  it("should reject non-email users", async () => {
    expect.assertions(2);
    let bad_email: string;
    bad_email = "thisisbad";
    await expect(service.init_new_user(bad_email)).rejects.toThrow();

    bad_email = "this is worse@gmail.com";
    await expect(service.init_new_user(bad_email)).rejects.toThrow();
  });
});
