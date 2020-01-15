import { Controller, Get, Param } from "@nestjs/common";
import { DbService, ExecutionID, Execution } from "src/db/db.service";

@Controller("reports")
export class ReportsController {
  private readonly _db_service: DbService;
  constructor(private readonly db_service: DbService) {
    this._db_service = db_service;
  }

  @Get(":id")
  async fetch_report(@Param("id") id: ExecutionID): Promise<Execution> {
    return this.db_service.get_by_id(id);
  }
}
