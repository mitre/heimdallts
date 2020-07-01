import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req
} from "@nestjs/common";
import { parse } from "inspecjs";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { ReqWithUser } from "../authn/authn.controller";
import { EvaluationsService } from "./evaluations.service";
import { models } from "heimdallts-db";
import { GroupsService } from "../groups/groups.service";
import { required } from "../utils";
import { IsString, IsObject, IsOptional, IsArray } from "class-validator";
import { SchemaValidationPipe } from "src/validation/schema.pipe";

export class EvaluationDTO {
  // The filename, if any, to tag the eval with
  @IsOptional()
  @IsString()
  filename!: string;

  // The JSON text of the evaluation. We expect it to be stringified client side
  @IsString()
  evaluation!: string;
}
export class AddToUsergroupDTO {
  @IsArray()
  ids!: number[];
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
    return this.groups.list_evaluation(gr);
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
  @Post("upload")
  async upload_personal_execution(
    @Req() req: ReqWithUser,
    @Body(new SchemaValidationPipe()) dto: EvaluationDTO
  ): Promise<void> {
    /** Lookup the personal usergroup of this user */
    let gr = await this.groups.get_personal_group(req.user);

    /** Upload the execution and store its id */
    let eva = await this.evaluations.intake_evaluation_dto(dto);

    /** Grant access */
    await this.evaluations.grant_access(gr, eva);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload/team/:name")
  async upload_team_evaluation(
    @Req() req: ReqWithUser,
    @Body(new SchemaValidationPipe()) dto: EvaluationDTO,
    @Param("name") team_name: string
  ): Promise<void> {
    /** Lookup the team, via membership */
    let team = await this.groups.get_team_by_name_by_user(team_name, req.user);

    /** Upload the execution and store its id */
    let eva = await this.evaluations.intake_evaluation_dto(dto);

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
  @Post("addusergroup/:id")
  async add_to_usergroup(
    @Param("id") id: number,
    @Req() req: ReqWithUser,
    @Body() evas_dto: AddToUsergroupDTO
  ): Promise<void> {
    let team = await this.groups.get_team_by_pk(id);
    for (let eva_id of evas_dto.ids) {
      let eva: models.Evaluation = await models.Evaluation.findByPk(eva_id).then(required)
      await this.evaluations.grant_access(team, eva);
    }
  }
}
