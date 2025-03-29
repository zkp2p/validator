import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { v1Registry } from "@/api/v1/";
import type { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry(v1Registry);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const config: OpenAPIObjectConfig = {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  };

  return {
    ...generator.generateDocument(config),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };
}
