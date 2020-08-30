const request = require("supertest");
const { Genre } = require("../../../models/GenreModel");
const mongoose = require("mongoose");
const { User } = require("../../../models/UsersModel");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { genre: "genre1", icon: "genre1.jpeg" },
        { genre: "genre2", icon: "genre2.jpeg" },
      ]);

      const res = await request(server).get("/api/genres");

      // Assertions made to test the number of files in genre and
      // the item to be the given item with given name.
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.genre === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.genre === "genre1")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the genre if valid ID is passed", async () => {
      let genre = new Genre({ genre: "genre1", icon: "genre1.jpeg" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("genre", genre.genre);
    });

    it("should return a 404 status for passsing an inValid ID", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return a 404 status if no genre with the given ID exist", async () => {
      const id = new mongoose.Types.ObjectId();

      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    //   refactoring the test to look more readable
    let token;
    let genre;
    let icon;

    const execute = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre, icon });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      genre = "genre1";
      icon = "genre1.jpeg";
    });

    it("should return 401 if client is not logged in", async () => {
      token = ""; // No token provided thus the user is not authorised to use the end point
      const res = await execute();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 charachters", async () => {
      genre = "gen"; // genreName set to less than 5 charachters
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 charachters", async () => {
      genre = new Array(52).join("a"); // genreName set to more than 50 charachters
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre Icon is not provided", async () => {
      icon = ""; // genreIcon is not provided
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should store the passed genre to mongoDB if valid genre is passed", async () => {
      const res = await execute();

      const genre = await Genre.find({ name: "genre1" });

      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it("should return the genre if valid genre is passed", async () => {
      const res = await execute();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("genre");
    });
  });
});
