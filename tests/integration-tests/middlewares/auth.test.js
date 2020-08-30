const auth = require("../../../middlewares/auth");
const { User } = require("../../../models/UsersModel");
const request = require("supertest");
const { Genre } = require("../../../models/GenreModel");
let server;

describe("auth Middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  let token;

  const execute = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ genre: "genre1", icon: "genre1.jpeg" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await execute();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is inValid", async () => {
    token = "a";
    const res = await execute();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is Valid", async () => {
    const res = await execute();

    expect(res.status).toBe(200);
  });
});
