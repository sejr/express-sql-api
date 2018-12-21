const app = require("../../src");
const request = require("supertest");

/**
 * This test suite goes through the entire account lifecycle for a single test
 * user. This includes account creation, retrieval, update, and deletion. With
 * that in mind, the order of these tests cannot be changed.
 */ 
describe("/users", () => {

  let testUser; // Placeholder for test user ID and token.

  /**
   * Unsuccessful user creation; invalid password.
   * @todo Maybe return with a more helpful error.
   */
  test("POST `/users` with valid email, invalid password", done => {
    const email = "steve@apple.com";
    const password = null;
    request(app)
      .post("/users")
      .send({ email, password })
      .set("Accept", "application/json")
      .expect(500, done);
  });

  /**
   * Unsuccessful user creation; invalid email.
   * @todo Maybe return with a more helpful error.
   */
  test("POST `/users` with invalid email, valid password", done => {
    const email = null;
    const password = "hello-world";
    request(app)
      .post("/users")
      .send({ email, password })
      .set("Accept", "application/json")
      .expect(500, done);
  });

  /**
   * Successful user creation from valid email and password.
   */
  test("POST `/users` with valid email and password", done => {
    const email = "steve@apple.com";
    const password = "hello-world";
    request(app)
      .post("/users")
      .send({ email, password })
      .set("Accept", "application/json")
      .expect(response => {
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("token");
  
        // So we can proceed with the remaining tests.
        testUser = response.body;
      }).expect(200, done);
  });

  /**
   * Unsuccessful retrieval of user profile from invalid ID.
   */
  test("GET `/users/:id` with invalid ID", done => {
    request(app)
      .get("/users/some-invalid-id")
      .expect(500, done);
  });
  
  /**
   * Successful retrieval of user profile from valid ID.
   */
  test("GET `/users/:id` with valid ID", done => {
    request(app)
      .get(`/users/${testUser.id}`)
      .expect(response => {
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("email");
        expect(response.body).not.toHaveProperty("hashedPassword");
      }).expect(200, done);
  });

  /**
   * Unsuccessful user deletion; no authorization header.
   */
  test("DELETE `/users/:id` with no authorization", done => {
    request(app)
      .delete(`/users/${testUser.id}`)
      .expect(401, done);
  });

  /**
   * Unsuccessful user deletion; valid token, wrong user.
   */
  test("DELETE `/users/:id` using token for different user", done => {
    request(app)
      .delete(`/users/some-other-user-id`)
      .set("authorization", `Bearer ${testUser.token}`)
      .expect(401, done);
  });

  /**
   * Successful user deletion from valid ID.
   */
  test("DELETE `/users/:id` with valid authorization and ID", done => {
    request(app)
      .delete(`/users/${testUser.id}`)
      .set("authorization", `Bearer ${testUser.token}`)
      .expect(response => {
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("deletedAt");
      }).expect(200, done);
  });
});