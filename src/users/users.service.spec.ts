import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { GroupsModule } from "../groups/groups.module";

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
});
