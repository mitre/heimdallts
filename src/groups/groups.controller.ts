import { Controller, Req, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { models } from "heimdallts-db";
import { required } from "../utils";
import { GroupsService } from "../groups/groups.service";
import { ReqWithUser } from "../authn/authn.controller";
import { IsString, IsNumber } from "class-validator";

/** The body of a registration Request */
class UsergroupDTO {
  @IsString()
  name!: string;
}
/** The body of a registration Request */
class UserDTO {
  @IsNumber()
  user_id!: number;
}

@Controller("teams")
export class GroupsController {
  constructor(
    private readonly groups: GroupsService
  ) {}

  //curl -X GET http://localhost:8050/teams/usergroups -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4ODI1ODI5NiwiZXhwIjoxNTg4MjYxODk2fQ.hrjlayxq4w0I6ZxhyR1XcjaGxmQHpesP01TUlhThAQ"
  @UseGuards(JwtAuthGuard)
  @Get("usergroups")
  async usergroups(@Req() req: ReqWithUser): Promise<models.Usergroup[]> {
    let personal_group = await this.groups.get_personal_group(req.user);
    let teams = await this.groups.get_teams(req.user);
    teams.unshift(personal_group);
    console.log(JSON.stringify(teams));
    return teams;
  }

  //curl -X GET http://localhost:8050/teams/2 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4ODI1Njc3OSwiZXhwIjoxNTg4MjYwMzc5fQ.MIiSj-xim_cGGOp7pHrxNF_TiSiYCxDtn61fnvcmpk0"
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async usergroup(
    @Param("id") group_id: number
  ): Promise<models.Usergroup> {
    let team = await this.groups.get_full_team_by_pk(group_id);
    return team;
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

  @UseGuards(JwtAuthGuard)
  @Post("usergroups")
  async new_usergroup(
    @Req() req: ReqWithUser,
    @Body() group_dto: UsergroupDTO
  ): Promise<models.Usergroup[]> {
    await this.groups.create_team(req.user, group_dto.name);
    let personal_group = await this.groups.get_personal_group(req.user);
    let ad_hocs = await this.groups.get_adhoc_groups(req.user);
    ad_hocs.unshift(personal_group)
    console.log(JSON.stringify(ad_hocs));
    return ad_hocs;
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/add")
  async add_to_usergroup(
    @Req() req: ReqWithUser,
    @Param("id") group_id: number,
    @Body() user_dto: UserDTO
  ): Promise<models.Usergroup> {
    let usergroup = await this.groups.get_full_team_by_pk(group_id);
    const for_user = await models.User.findByPk(user_dto.user_id);
    let membership_type: models.MembershipType = "user";
    if (for_user) {
      await this.groups.join(usergroup, for_user, membership_type)
    }
    let team = await this.groups.get_full_team_by_pk(group_id);
    return team;
  }
}
