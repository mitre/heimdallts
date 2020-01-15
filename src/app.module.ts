import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DbModule } from "./db/db.module";
import { ReportsModule } from "./reports/reports.module";

@Module({
  imports: [AuthModule, UsersModule, DbModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
