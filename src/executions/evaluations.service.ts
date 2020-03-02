import { Injectable } from "@nestjs/common";
import { parse } from "inspecjs";
import { required } from "src/utils";
import { models, intake, output } from "hdf-db-sequelize";

@Injectable()
export class EvaluationsService {
  async get_by_pk(pk: number): Promise<parse.AnyExec> {
    const mdl = await models.Evaluation.findByPk(pk).then(required);
    return output.convert_evaluation(mdl);
  }

  async list_evaluations(): Promise<models.Evaluation[]> {
    return models.Evaluation.findAll({
      include: ["id"]
    });
  }

  async intake_evaluation(
    evaluation: parse.AnyExec
  ): Promise<models.Evaluation> {
    return intake.intake_evaluation(evaluation).then(e => e.id);
  }
}
