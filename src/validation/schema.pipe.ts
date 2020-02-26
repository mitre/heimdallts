import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

/** Validates a class using the class-validator and class-transformer libraries */
@Injectable()
export class SchemaValidationPipe<T> implements PipeTransform<T, Promise<T>> {
  async transform(value: T, amd: ArgumentMetadata): Promise<T> {
    // Get the metatype
    const metatype = amd.metatype;
    console.log("---");
    console.log(value);
    console.log(amd);
    if (!metatype || !this.toValidate(metatype)) {
      // If we don't need to validate this type, then we don't!
      return value;
    }

    // Rebind as a typed class, and check for validation errors
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log("Request failed due to non-schema-comformant body");
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
