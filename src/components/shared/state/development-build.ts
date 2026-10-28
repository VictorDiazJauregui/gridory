declare const process: { env: { NODE_ENV?: string } };

// Bundlers replace `process.env.NODE_ENV` with a literal, so it is written exactly like that. Without a
// bundler the browser has no `process`: that ReferenceError means "not a development build".
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
