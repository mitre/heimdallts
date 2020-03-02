import { Module } from "@nestjs/common";
import { EvaluationsController } from "./evaluations.controller";
import { EvaluationsService } from "./evaluations.service";

@Module({
  providers: [EvaluationsService],
  controllers: [EvaluationsController],
  exports: [EvaluationsService]
})
export class EvaluationsModule {}
