import { Module } from "@nestjs/common";
import { ExecutionController } from "./executions.controller";

@Module({
  controllers: [ExecutionController]
})
export class ReportsModule {}
