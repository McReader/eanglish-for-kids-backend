const supertest = require("supertest");
const app = require("../app");

let request;

beforeAll(() => {
  request = supertest(app);
});

describe("Given I have no any categories created", () => {
  describe("When I'm creating a category", () => {
    let requestBody;
    let response;

    beforeAll(async () => {
      requestBody = {
        name: "Test category",
      };

      response = await request.post("/api/categories").send(requestBody);
    });

    it("Then I should receive a 201 status response", () => {
      expect(response.status).toBe(201);
    });

    it("And I should receive a correct response body", () => {
      expect(response.body).toEqual({
        _id: expect.any(String),
        name: requestBody.name,
      });
    });
  });
});
