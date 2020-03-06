import { Module } from "@nestjs/common";
import { ApiService } from "./api.service";
import { ApiController } from "./api.controller";
import { EvaluationsModule } from "src/evaluations/evaluations.module";

@Module({
  imports: [EvaluationsModule],
  providers: [ApiService],
  controllers: [ApiController],
  exports: [ApiService]
})
export class ApiModule {}
