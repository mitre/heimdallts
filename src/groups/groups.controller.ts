import { Controller, Req, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
//import { EvaluationsService } from "../evaluations/evaluations.service";
import { models } from "heimdallts-db";
import { GroupsService } from "../groups/groups.service";
import { ReqWithUser } from "../authn/authn.controller";

@Controller("teams")
export class GroupsController {
  constructor(
    //private readonly evaluations: EvaluationsService,
    private readonly groups: GroupsService
  ) {}

  //curl -X GET http://localhost:8050/teams/usergroups -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4ODI1ODI5NiwiZXhwIjoxNTg4MjYxODk2fQ.hrjlayxq4w0I6ZxhyR1XcjaGxmQHpesP01TUlhThAQ"
  @UseGuards(JwtAuthGuard)
  @Get("usergroups")
  async usergroups(@Req() req: ReqWithUser): Promise<models.Usergroup[]> {
    let personal_group = await this.groups.get_personal_group(req.user);
    let ad_hocs = await this.groups.get_adhoc_groups(req.user);
    ad_hocs.unshift(personal_group);
    console.log(JSON.stringify(ad_hocs));
    return ad_hocs;
  }

  //curl -X GET http://localhost:8050/teams/teamname_1/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4ODI1Njc3OSwiZXhwIjoxNTg4MjYwMzc5fQ.MIiSj-xim_cGGOp7pHrxNF_TiSiYCxDtn61fnvcmpk0"
  @UseGuards(JwtAuthGuard)
  @Get(":name/list")
  async list_team_reports(
    @Param("name") team_name: string
  ): Promise<models.Evaluation[]> {
    let team = await this.groups.get_team_by_name(team_name);
    return this.groups.list_evaluation(team);
  }
}
