import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from "@nestjs/common";
import { parse } from "inspecjs";

@Injectable()
export class HDFParsePipe implements PipeTransform<object, parse.AnyExec> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: object, metadata: ArgumentMetadata): parse.AnyExec {
    try {
      console.log(value);
      console.log(typeof value);
      const parsed = parse.convertFile(JSON.stringify(value));
      if (!parsed["1_0_ExecJson"]) {
        throw new Error("Did not parse to expected format");
      }
      return parsed["1_0_ExecJson"];
    } catch (e) {
      throw new BadRequestException("File is non-compliant with HDF schema.");
    }
  }
}
