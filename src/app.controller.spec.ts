import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppModule } from "./app.module";
import { get_db } from "./db";

describe("AppController", () => {
  let app_service: AppService;
  let app_controller: AppController;

  beforeEach(async () => {
    app_service = new AppService();
    app_controller = new AppController(app_service);
    /*
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    app_controller = app.get<AppController>(AppController);
    */
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
