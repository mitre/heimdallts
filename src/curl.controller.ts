import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Param,
  Query
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EvaluationsService } from "./executions/evaluations.service";
import { ApiKeyGuard } from "src/authn/apikey.auth-guard";

@Controller()
export class CurlController {
  constructor(private readonly eval_service: EvaluationsService) {}

  // @UseInterceptors(FileInterceptor("file"))
  // @UseGuards(ApiKeyGuard)
  @Post("evaluation_upload_api")
  //async upload_execution(@UploadedFile() file: any): Promise<void> {
  async upload_execution(@Body() dadbod: any): Promise<void> {
    // console.log(file);
    console.log(dadbod);
    return;
  }
}

// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "circle=CIRCLE NAME" http://localhost:3000/evaluation_upload_api
// curl -F "file=@FILE_PATH" -F "email=EMAIL" -F "api_key=API_KEY" -F "hostname=HOSTNAME" -F "uuid=UUID" -F "fisma system=FISMA" -F "environment=test" http://localhost:3000/evaluation_upload_api
