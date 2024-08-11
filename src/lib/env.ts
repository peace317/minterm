import z from "zod";

const environmentVariables = z.object({
  REACT_APP_ALLOW_CONTEXT_MENU: z.string().default("true"),
  UPDATE_PORT_LIST_INTERVAL: z.coerce.number().default(5000),
});

const parsedResults = environmentVariables.safeParse(process.env);

if (!parsedResults.success) {
  console.error(parsedResults.error);
  throw new Error(
    "Environment variables don't match the schema.",
    parsedResults.error
  );
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface ProcessEnv extends z.infer<typeof environmentVariables> {}
  }
}
