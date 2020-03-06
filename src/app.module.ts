import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./authn/authn.module";
import { UsersModule } from "./users/users.module";
import { EvaluationsModule } from "./evaluations/evaluations.module";
import { MulterModule } from "@nestjs/platform-express";
import { ApiModule } from "./api/api.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EvaluationsModule,
    ApiModule,
    MulterModule.register({
      dest: "./tmp"
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
