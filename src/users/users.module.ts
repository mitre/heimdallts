import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { GroupsModule } from "src/groups/groups.module";

@Module({
  imports: [GroupsModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
