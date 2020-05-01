import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from "@nestjs/common";
import { parse } from "inspecjs";

export class EvalContainer {
  evaluation!: parse.AnyExec;
}
@Injectable()
export class HDFParsePipe implements PipeTransform<object, parse.AnyExec> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: object, metadata: ArgumentMetadata): parse.AnyExec {
    try {
      if (value.hasOwnProperty('evaluation')) {
        let pre_val: EvalContainer = value as EvalContainer;
        value = pre_val.evaluation;
      }
      console.log(JSON.stringify(value));
      const parsed = parse.convertFile(JSON.stringify(value));
      if (!parsed["1_0_ExecJson"]) {
        console.log("Did not parse");
        throw new Error("Did not parse to expected format");
      }
      return parsed["1_0_ExecJson"];
    } catch (e) {
      console.log("Error" + e);
      throw new BadRequestException("File is non-compliant with HDF schema.");
    }
  }
}
