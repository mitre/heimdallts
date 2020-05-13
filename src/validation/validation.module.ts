import { Module } from "@nestjs/common";
import { SchemaValidationPipe } from "./schema.pipe";

@Module({
  providers: [SchemaValidationPipe]
})
export class PipeModule {}
