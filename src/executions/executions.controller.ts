import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { HDFParsePipe } from "src/validation/hdf.pipe";
import { parse } from "inspecjs";
import { models, intake, output } from "hdf-db-sequelize";
import { required } from "src/utils";
import { JwtAuthGuard } from "src/auth/jwt.authguard";

@Controller("executions")
export class ExecutionController {
  @Get()
  async list_reports(): Promise<models.Evaluation[]> {
    return models.Evaluation.findAll({
      include: ["id"]
    }); // this.db_service.sequelize.list_ids();
  }

  @UseGuards(JwtAuthGuard)
  @Get("fetch/:id")
  async fetch_report(@Param("id") id: number): Promise<parse.AnyExec> {
    const mdl = await models.Evaluation.findByPk(id).then(required);
    return output.convert_evaluation(mdl);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async upload_execution(
    @Body(new HDFParsePipe()) execution: parse.AnyExec
  ): Promise<number> {
    /** Upload the execution and store its id */
    return intake.intake_evaluation(execution).then(e => e.id);
  }
}
