export class RequiredException extends Error {}
export async function required<T>(v: T | undefined | null): Promise<T> {
  if (v === undefined || v === null) {
    throw new RequiredException();
  }
  return v;
}
