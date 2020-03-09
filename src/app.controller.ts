import { AppService } from "./app.service";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(private readonly app_service: AppService) {}

  @Get()
  index(): string {
    return this.app_service.get_index();
  }

  /** This controller method should never be changed. Checks the validity of a connection */
  @Get("check_alive")
  check_alive(): string {
    return "HS_ALIVE";
  }
}
