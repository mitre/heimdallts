import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";

@Module({
  providers: [GroupsService],
  controllers: [],
  exports: [GroupsService]
})
export class GroupsModule {}
