import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { app } from "@/server";

import { generateOpenAPIDocument } from "../openAPIDocumentGenerator";

describe("OpenAPI Router", () => {
  describe("Swagger JSON route", () => {
    it("should return Swagger UI HTML content", async () => {
      // Act
      const response = await request(app).get("/docs/");

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.type).toBe("text/html");
      expect(response.text).toContain("swagger-ui");
    });

    it("should return Swagger JSON content", async () => {
      // Arrange
      const expectedResponse = generateOpenAPIDocument();

      // Act
      const response = await request(app).get("/docs/swagger.json");

      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual(expectedResponse);
    });
  });
});
