import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { EvaluationsService } from "../evaluations/evaluations.service";
import { models } from "heimdallts-db";
import { GroupsService } from "../groups/groups.service";

@Controller("teams")
export class GroupsController {
  constructor(
    private readonly evaluations: EvaluationsService,
    private readonly groups: GroupsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(":name/list")
  async list_team_reports(
    @Param("name") team_name: string
  ): Promise<models.Evaluation[]> {
    let team = await this.groups.get_team_by_name(team_name);
    return this.groups.list_evaluation(team);
  }
}
