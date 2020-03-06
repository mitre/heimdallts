import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionController } from "./evaluations.controller";

describe("Executions Controller", () => {
  let controller: ExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutionController]
    }).compile();

    controller = module.get<ExecutionController>(ExecutionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
