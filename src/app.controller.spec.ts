import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let app_service: AppService;
  let app_controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    app_controller = app.get<AppController>(AppController);
  });

  describe("index", () => {
    it('should return "Hello world!"', () => {
      expect(app_controller.index()).toBe("Hello World!");
    });
  });

  describe("alive", () => {
    it('should return "HS_ALIVE"', () => {
      expect(app_controller.check_alive()).toBe("HS_ALIVE");
    });
  });
});
