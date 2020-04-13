import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req
} from "@nestjs/common";
import { HDFParsePipe } from "../validation/hdf.pipe";
import { parse } from "inspecjs";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { ReqWithUser } from "../authn/authn.controller";
import { EvaluationsService } from "./evaluations.service";
import { models } from "heimdallts-db";
import { GroupsService } from "../groups/groups.service";

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
  @Post("upload")
  async upload_personal_execution(
    @Req() req: ReqWithUser,
    @Body(new HDFParsePipe()) evaluation: parse.AnyExec
  ): Promise<void> {
    /** Lookup the personal usergroup of this user */
    let gr = await this.groups.get_personal_group(req.user);

    /** Upload the execution and store its id */
    let eva = await this.evaluations.intake_evaluation_json(evaluation);

    /** Grant access */
    await this.evaluations.grant_access(gr, eva);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload/team/:name")
  async upload_team_evaluation(
    @Req() req: ReqWithUser,
    @Body(new HDFParsePipe()) evaluation: parse.AnyExec,
    @Param("name") team_name: string
  ): Promise<void> {
    /** Lookup the team, via membership */
    let team = await this.groups.get_team_by_name_by_user(team_name, req.user);

    /** Upload the execution and store its id */
    let eva = await this.evaluations.intake_evaluation_json(evaluation);

    /** Grant access */
    await this.evaluations.grant_access(team, eva);
  }

  @UseGuards(JwtAuthGuard)
  @Get("fetch/team/:name")
  async list_team_evaluations(
    @Req() req: ReqWithUser,
    @Param("name") team_name: string
  ): Promise<void> {
    throw "Not done!";
  }
}
