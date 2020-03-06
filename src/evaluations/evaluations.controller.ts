import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req
} from "@nestjs/common";
import { HDFParsePipe } from "src/validation/hdf.pipe";
import { parse } from "inspecjs";
import { required } from "src/utils";
import { JwtAuthGuard } from "src/authn/jwt.authn-guard";
import { ReqWithUser } from "src/authn/authn.controller";
import { EvaluationsService } from "./evaluations.service";
import { models } from "hdf-db-sequelize";
import { GroupsService } from "src/groups/groups.service";

@Controller("executions")
export class EvaluationsController {
  constructor(
    private readonly evaluations: EvaluationsService,
    private readonly groups: GroupsService
  ) {}

  @Get()
  async list_reports(): Promise<models.Evaluation[]> {
    return this.evaluations.list_evaluations();
  }

  @UseGuards(JwtAuthGuard)
  @Get("fetch/:id")
  async fetch_report(@Param("id") id: number): Promise<parse.AnyExec> {
    return this.evaluations.get_by_pk(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async upload_personal_execution(
    @Req() req: ReqWithUser,
    @Body(new HDFParsePipe()) evaluation: parse.AnyExec
  ): Promise<void> {
    /** Upload the execution and store its id */
    let eva = await this.evaluations.intake_evaluation_json(evaluation);

    /** Lookup the personal usergroup of this user */
  }
}
