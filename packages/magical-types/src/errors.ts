export class InternalError extends Error {
  constructor(message: string) {
    super(
      `The following error shouldn't happen, please open an issue with the following error message, stack trace and the contents of the file this failed on: ${message}`
    );
  }
}
