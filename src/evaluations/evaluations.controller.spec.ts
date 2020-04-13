import { Test, TestingModule } from "@nestjs/testing";
import { EvaluationsController } from "./evaluations.controller";
import { EvaluationsModule } from "./evaluations.module";
import { GroupsModule } from "../groups/groups.module";

describe("Executions Controller", () => {
  let controller: EvaluationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EvaluationsModule, GroupsModule],
      controllers: [EvaluationsController]
    }).compile();

    controller = module.get<EvaluationsController>(EvaluationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
