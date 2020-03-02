import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./authn/authn.module";
import { UsersModule } from "./users/users.module";
import { EvaluationsModule } from "./executions/evaluations.module";
import { CurlController } from "./curl.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EvaluationsModule,
    MulterModule.register({
      dest: "./tmp"
    })
  ],
  controllers: [AppController, CurlController],
  providers: [AppService]
})
export class AppModule {}
