import { Module } from "@nestjs/common";
import { HDFParsePipe } from "./hdf.pipe";
import { SchemaValidationPipe } from "./schema.pipe";

@Module({
  providers: [HDFParsePipe, SchemaValidationPipe]
})
export class PipeModule {}
