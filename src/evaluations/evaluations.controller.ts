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

  //curl -X GET http://localhost:8050/executions/personal -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4ODI1Njc3OSwiZXhwIjoxNTg4MjYwMzc5fQ.MIiSj-xim_cGGOp7pHrxNF_TiSiYCxDtn61fnvcmpk0"
  @UseGuards(JwtAuthGuard)
  @Get("personal")
  async list_personal_reports(
    @Req() req: ReqWithUser
  ): Promise<models.Evaluation[]> {
    let gr = await this.groups.get_personal_group(req.user);
    return this.groups.list_evaluation(gr)
  }

  @UseGuards(JwtAuthGuard)
  @Get("fetch/:id")
  async fetch_report(@Param("id") id: number): Promise<parse.AnyExec> {
    return this.evaluations.get_by_pk(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("tags/:id")
  async fetch_tags(@Param("id") id: number): Promise<models.Tag[]> {
    return this.evaluations.get_tags(id);
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
    let gr = await this.groups.get_personal_group(req.user);

    /** Grant access */
    await this.evaluations.grant_access(gr, eva);

    /* Add tags */
    const filename: string | undefined = req.body.filename;
    if (filename) {
      console.log("filename: " + filename);
      this.evaluations.add_tag(eva, "filename", filename);
    }

  }

}
