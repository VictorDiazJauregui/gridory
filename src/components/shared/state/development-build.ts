declare const process: { env: { NODE_ENV?: string } };

// The consumer's bundler replaces `process.env.NODE_ENV` with a literal, so the check has to be
// written exactly like that. A browser loading the package without a bundler has no `process`:
// that ReferenceError means "not a development build".
const readNodeEnvironment = (): string | undefined => {
  try {
    return process.env.NODE_ENV;
  } catch (error) {
    if (error instanceof ReferenceError) return undefined;
    throw error;
  }
};

export const isDevelopmentBuild = () => {
  const environment = readNodeEnvironment();
  return environment !== undefined && environment !== "production";
};
