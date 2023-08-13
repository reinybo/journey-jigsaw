import { NxMonorepoProject } from "@aws-prototyping-sdk/nx-monorepo";
import {
  DocumentationFormat,
  Language,
  Library,
  ModelLanguage,
  TypeSafeApiProject,
} from "@aws-prototyping-sdk/type-safe-api";
import { AwsCdkTypeScriptApp } from "projen/lib/awscdk";
import { ReactTypeScriptProject } from "projen/lib/web";

const monorepo = new NxMonorepoProject({
  defaultReleaseBranch: "main",
  devDeps: [
    "@aws-prototyping-sdk/nx-monorepo",
    "@aws-prototyping-sdk/type-safe-api",
  ],
  name: "journey-jigsaw",
  projenrcTs: true,
});

// Create the API project
const api = new TypeSafeApiProject({
  name: "api",
  parent: monorepo,
  outdir: "packages/api",
  // Smithy as the model language. You can also use ModelLanguage.OPENAPI
  model: {
    language: ModelLanguage.SMITHY,
    options: {
      smithy: {
        serviceName: {
          namespace: "com.shockerella",
          serviceName: "api",
        },
      },
    },
  },
  // Generate types, client and server code in TypeScript, Python and Java
  runtime: {
    languages: [Language.TYPESCRIPT],
  },
  // CDK infrastructure in TypeScript
  infrastructure: {
    language: Language.TYPESCRIPT,
  },
  // Generate HTML documentation
  documentation: {
    formats: [DocumentationFormat.HTML_REDOC],
  },
  // Generate react-query hooks to interact with the UI from a React website
  library: {
    libraries: [Library.TYPESCRIPT_REACT_QUERY_HOOKS],
  },
});

// Create a CDK infrastructure project. Can also consider PDKPipelineTsProject as an alternative!
const infra = new AwsCdkTypeScriptApp({
  defaultReleaseBranch: "main",
  cdkVersion: "2.0.0",
  parent: monorepo,
  outdir: "packages/infra",
  name: "infra",
  deps: ["@aws-prototyping-sdk/type-safe-api", "aws-sdk"],
});

const client = new ReactTypeScriptProject({
  defaultReleaseBranch: "main",
  deps: [
    "react-router-dom",
    "@emotion/react",
    "@emotion/styled",
    "@mui/icons-material",
    "@mui/material",
    "@mui/core",
  ],
  parent: monorepo,
  outdir: "packages/client",
  name: "client",
  gitignore: [".DS_Store"],
  tsconfig: {
    compilerOptions: {},
    include: ["src/**/*.tsx"],
  },
});

// Infrastructure can depend on the generated API infrastructure and runtime
infra.addDeps(api.infrastructure.typescript!.package.packageName);
infra.addDeps(api.runtime.typescript!.package.packageName);

client.addDeps(api.infrastructure.typescript!.package.packageName);
client.addDeps(api.runtime.typescript!.package.packageName);

client.addTask("start", {
  exec: "react-scripts start",
});

monorepo.synth();
