import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EvaluationsService } from "../evaluations/evaluations.service";
import { Request } from "express";
import { read_file_async } from "../utils";
import * as fs from "fs";
import { ApiService } from "./api.service";

@Controller()
export class ApiController {
  constructor(
    private readonly api_service: ApiService,
    private readonly eval_service: EvaluationsService
  ) {}

  @UseInterceptors(FileInterceptor("file"))
  @Post("evaluation_upload_api")
  async upload_execution(
    @Req() req: Request,
    @UploadedFile() file: any
  ): Promise<string> {
    // Do the check
    let group = (await this.api_service.check_user(req))[1]; // Don't need user

    // Do intake of file
    const file_contents = await read_file_async(file.path).then(x =>
      x.toString()
    );

    // Delete it
    fs.unlink(file.path, () => null);

    // Intake it and give it to the calling owner
    const eva = await this.eval_service.intake_evaluation_raw(file_contents);
    await this.eval_service.grant_access(group, eva);

    return "ok";
  }
}

// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "circle=CIRCLE NAME" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "hostname=HOSTNAME" -F "uuid=UUID" -F "fisma system=FISMA" -F "environment=test" http://localhost:3000/evaluation_upload_api
