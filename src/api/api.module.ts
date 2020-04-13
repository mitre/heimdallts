import { Module } from "@nestjs/common";
import { ApiService } from "./api.service";
import { ApiController } from "./api.controller";
import { EvaluationsModule } from "../evaluations/evaluations.module";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [EvaluationsModule, GroupsModule],
  providers: [ApiService],
  controllers: [ApiController],
  exports: [ApiService]
})
export class ApiModule {}
