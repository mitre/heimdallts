import { Injectable, BadRequestException } from "@nestjs/common";
import { parse } from "inspecjs";
import { required } from "../utils";
import { models, intake, output } from "heimdallts-db";
import { EvaluationDTO } from "./evaluations.controller";

@Injectable()
export class EvaluationsService {
  async get_by_pk(pk: number): Promise<parse.AnyExec> {
    const mdl = await models.Evaluation.findByPk(pk).then(required);
    return output.convert_evaluation(mdl);
  }

  /** Returns a list of all evaluations in the dataset. Should be depracated or at least narrowed in scope */
  async list_evaluations(): Promise<models.Evaluation[]> {
    return models.Evaluation.findAll({
      include: ["id"]
    });
  }

  /** Returns all tags on an evaluation. */
  async get_tags(pk: number): Promise<models.Tag[]> {
    return models.Tag.findAll({
      where: {
        tagger_id: pk,
        tagger_type: "Evaluation"
      }
    });
  }

  /** Gives a usergroup access to an evaluation.
   * Returns the binding entity
   */
  async grant_access(
    usergroup: models.Usergroup,
    evaluation: models.Evaluation
  ): Promise<models.EvaluationUsergroup> {
    // check if it's there already
    let existing = await models.EvaluationUsergroup.findOne({
      where: {
        evaluation_id: evaluation.id,
        usergroup_id: usergroup.id
      }
    });

    // If it isn't, create it. If it is, return it
    if (existing == null) {
      return models.EvaluationUsergroup.create({
        evaluation_id: evaluation.id,
        usergroup_id: usergroup.id
      });
    } else {
      return existing;
    }
  }

  /** Takes a usergroups access to an evaluation away.
   */
  async remove_access(
    usergroup: models.Usergroup,
    evaluation: models.Evaluation,
    cleanup: boolean
  ): Promise<void> {
    // c a s t i g a t e
    await models.EvaluationUsergroup.destroy({
      where: {
        evaluation_id: evaluation.id,
        usergroup_id: usergroup.id
      }
    });

    // Check cleanup
    if (cleanup) {
      await this.consider_cleanup(evaluation);
    }
  }

  /** Checks if an evaluation has any owning usergroups. If not, deletes the evaluation.
   * Returns true if deleted
   */
  async consider_cleanup(evaluation: models.Evaluation): Promise<boolean> {
    if (
      (await models.EvaluationUsergroup.findOne({
        where: {
          evaluation_id: evaluation.id
        }
      })) !== null
    ) {
      return false;
    } else {
      evaluation.destroy();
      return true;
    }
  }

  /** Intakes a pre-parsed/typecheked json */
  async intake_evaluation_json(
    evaluation: parse.AnyExec
  ): Promise<models.Evaluation> {
    return await intake.intake_evaluation(evaluation);
  }

  /** Intakes a raw json text */
  async intake_evaluation_raw(
    evaluation_json_text: string
  ): Promise<models.Evaluation> {
    try {
      const parsed = parse.convertFile(evaluation_json_text);
      if (parsed["1_0_ExecJson"]) {
        return this.intake_evaluation_json(parsed["1_0_ExecJson"]);
      } else {
        throw null;
      }
    } catch (e) {
      throw new BadRequestException("Invalid inspec JSON evaluation");
    }
  }

  /**
   * Intakes an Evaluation DTO.
   * This essentially just wraps intake_evaluation_raw
   * and adds tags
   */
  async intake_evaluation_dto(dto: EvaluationDTO): Promise<models.Evaluation> {
    /** Upload the execution and store its id */
    let eva = await this.intake_evaluation_raw(dto.evaluation);

    /* Add tags. Given that this is duplicate behavior, this should maybe broken to a helper function */
    if (dto.filename) {
      this.add_tag(eva, "filename", dto.filename);
    }
    return eva;
  }

  /** Gives a usergroup access to an evaluation.
   * Returns the binding entity
   */
  async add_tag(
    evaluation: models.Evaluation,
    name: string,
    value: string
  ): Promise<models.Tag> {
    // check if it's there already
    let content = JSON.parse(`{"name": "${name}", "value": "${value}"}`);
    let existing = await models.Tag.findOne({
      where: {
        tagger_id: evaluation.id,
        tagger_type: "Evaluation",
        content: content
      }
    });

    // If it isn't, create it. If it is, return it
    if (existing == null) {
      console.log("create tag");
      return models.Tag.create({
        tagger_id: evaluation.id,
        tagger_type: "Evaluation",
        content: content
      });
    } else {
      console.log("tag exists");
      return existing;
    }
  }
}
