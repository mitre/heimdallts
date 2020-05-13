import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Param
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EvaluationsService } from "../evaluations/evaluations.service";
import { Request } from "express";
import { read_file_async } from "../utils";
import * as fs from "fs";
import { ApiService } from "./api.service";
import { GroupsService } from "../groups/groups.service";
import { JwtAuthGuard } from "../authn/jwt.authn-guard";
import { ReqWithUser } from "../authn/authn.controller";
import { BaseError } from "make-error";

class GroupAlreadyExistsException extends BaseError {
  constructor(team_name: string) {
    super(`Team ${team_name} already exists.`);
  }
}
@Controller()
export class ApiController {
  constructor(
    private readonly api_service: ApiService,
    private readonly eval_service: EvaluationsService,
    private readonly group_service: GroupsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("api/generate_team_key/:team_name")
  async generate_key(
    @Req() req: ReqWithUser,
    @Param("team_name") team_name: string
  ): Promise<string> {
    // Get the team
    const team = await this.group_service.get_team_by_name_by_user(
      team_name,
      req.user
    );

    let new_key = await this.api_service.regenerate_key(team.Membership, null);

    return new_key.key;
  }

  @UseInterceptors(FileInterceptor("file", { dest: "uploads/" }))
  @Post("evaluation_upload_api")
  async upload_execution(
    @Req() req: Request,
    @UploadedFile() file: any
  ): Promise<string> {
    // Do the check
    let group = (await this.api_service
      .check_user(req)
      .then(x => x.$get("usergroup")))!;

    console.log("file: " + JSON.stringify(file.originalname));
    // Do intake of file
    const file_contents = await read_file_async(file.path).then(x =>
      x.toString()
    );

    // Delete the temp file
    fs.unlink(file.path, () => null);

    console.log("params: " + JSON.stringify(req.params));
    console.log("query: " + JSON.stringify(req.query));
    // Intake it and give it to the calling owner
    const eva = await this.eval_service.intake_evaluation_raw(file_contents);
    await this.eval_service.grant_access(group, eva);

    // tag the evaluation
    this.eval_service.add_tag(eva, "filename", file.originalname);
    const tag: string[] | undefined = req.body.tag;
    if (tag) {
      console.log("tag: " + JSON.stringify(tag));
      for (let key in tag) {
        this.eval_service.add_tag(eva, key, tag[key]);
      }
    }
    return "ok";
  }
}

// r23hjgrkrgktgkjgfaksgksaggas3rhu3hd
// curl -F "file=@good_nginxresults.json"  -F "email=email@gmail.com" -F "api_key=r23hjgrkrgktgkjgfaksgksaggas3rhu3hd" -F "tag[fisma]=FISMA" -F "tag[nist]=NIST" http://localhost:8050/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "circle=CIRCLE NAME" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "hostname=HOSTNAME" -F "uuid=UUID" -F "fisma system=FISMA" -F "environment=test" http://localhost:3000/evaluation_upload_api
