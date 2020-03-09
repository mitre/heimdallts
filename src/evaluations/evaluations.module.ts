import { Module } from "@nestjs/common";
import { EvaluationsController } from "./evaluations.controller";
import { EvaluationsService } from "./evaluations.service";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [GroupsModule],
  providers: [EvaluationsService],
  controllers: [EvaluationsController],
  exports: [EvaluationsService]
})
export class EvaluationsModule {}
