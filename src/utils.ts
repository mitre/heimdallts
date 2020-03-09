import * as fs from "fs";
import { SSL_OP_EPHEMERAL_RSA } from "constants";

export class RequiredException extends Error {}
/** Throws an exception if its input resolves to null or undefined */
export async function required<T>(v: T | undefined | null): Promise<T> {
  if (v === undefined || v === null) {
    throw new RequiredException();
  }
  return v;
}

/** Adapts the callback-based file async function to a promise based one */
export async function read_file_async(
  path: string | number | Buffer | URL
  // options?: { encoding?: null; flag?: string | null }
): Promise<Buffer> {
  return new Promise((success, failure) => {
    fs.readFile(path, null, (err, data) => {
      if (err) {
        failure(err);
      } else {
        success(data);
      }
    });
  });
}

export async function sleep(timeout_ms?: number): Promise<void> {
  return new Promise(success => {
    setTimeout(success, timeout_ms);
  });
}
