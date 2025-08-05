/** ---------------------------------
 * * ***Custom Error for Pathname Normalization Failures***
 * ---------------------------------
 */
export class NormalizePathnameError extends Error {
  constructor(message: string, public originalError: Error) {
    super(message);
    this.name = "NormalizePathnameError";
    // Preserve stack trace in non-production environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NormalizePathnameError);
    }
  }
}
