import { Test, TestingModule } from "@nestjs/testing";
import { EvaluationsController } from "./evaluations.controller";

describe("Executions Controller", () => {
  let controller: EvaluationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationsController]
    }).compile();

    controller = module.get<EvaluationsController>(EvaluationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
