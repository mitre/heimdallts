import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  get_index(): string {
    return "Hello World!";
  }
}
