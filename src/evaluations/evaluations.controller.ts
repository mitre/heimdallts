import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
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
import { IsString } from "class-validator";

/** The body of a registration Request */
class TagDTO {
  @IsString()
  name!: string;

  @IsString()
  value!: string;
}

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
  @Delete(":id/tags/:tag_id")
  async remove(@Param('id') id: number, @Param('tag_id') tag_id: number): Promise<models.Tag[]> {
    this.evaluations.remove_tag(id, tag_id);
    return this.evaluations.get_tags(id);
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

    /* Add tags */
    const filename: string | undefined = req.body.filename;
    if (filename) {
      console.log("filename: " + filename);
      this.evaluations.add_tag(eva, "filename", filename);
    }

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

  @UseGuards(JwtAuthGuard)
  @Post("tags/:id")
  async upload_tag(
    @Param("id") id: number,
    @Req() req: ReqWithUser,
    @Body() tag_dto: TagDTO
  ): Promise<void> {
    const eva = await models.Evaluation.findByPk(id);
    /* Add tag */
    if (eva) {
      await this.evaluations.add_tag(eva, tag_dto.name, tag_dto.value);
    }
  }

}
