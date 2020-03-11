import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { GroupsModule } from "../groups/groups.module";
import { models } from "heimdallts-db";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GroupsModule],
      providers: [UsersService]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  let email = "bob@dylan.com";
  let user: models.User;
  let pass: "some long password %^$(";
  let login: models.AuthUserPass;
  it("should successfully create a user", async () => {
    // let fake_password = "for_president";
    let result = await service.init_new_user(email);
    expect(result).toBeDefined();
  });

  it("should be able to recall that user", async () => {
    let _user = await service.get_user_by_email(email);
    expect(_user).resolves;
  });

  it("should be able to give them a login", async () => {
    let _login = service.create_user_login(user, email, pass).then(v => {
      login = v;
    });
    expect(_login).resolves;
  });

  it("should be able to recall their auth using email", async () => {
    expect(await service.get_login_by_username(email)).toBe(login);
  });

  it("should reject non-email users", async () => {
    let bad_email: string;
    bad_email = "thisisbad";
    await expect(service.init_new_user(bad_email)).rejects;

    bad_email = "this is worse@gmail.com";
    await expect(service.init_new_user(bad_email)).rejects;
  });
});
