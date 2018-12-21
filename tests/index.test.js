const app = require("../src");
const request = require("supertest");

describe("/", () => {
  test("GET /", done => {
    request(app).get("/")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});