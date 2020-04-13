import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./authn.service";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "./authn.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
      providers: []
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
