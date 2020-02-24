import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./executions/executions.module";

@Module({
  imports: [AuthModule, UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
