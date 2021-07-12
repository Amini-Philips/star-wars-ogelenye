import request from "supertest";
import app from "../index.js";

describe("Testing the API Movies endpoint", () => {
  it("Should return a JSON object containing Movies and their Comment counts", async () => {
    const response = await request(app).get("/api/movies/");
    expect(response.body.length).toBe(6);
    expect(response.body[0]).toHaveProperty("movie");
    expect(response.body[0]).toHaveProperty("commentCount");
    expect(response.statusCode).toBe(200);
  });
});

describe("Testing the API Characters endpoint", () => {
  it(
    "Should return a JSON object containing list all male characters sorted by names " +
      "in ascending order",
    async () => {
      const response = await request(app).get("/api/characters/male/name/ASC");
      expect(response.body.characters.length).toBe(5);
      expect(response.body.characters.length).toEqual(
        response.body.totalCharacters
      );
      expect(response.body).toHaveProperty("characters");
      expect(response.body).toHaveProperty("totalCharacters");
      expect(response.body).toHaveProperty("totalHeightsInCm");
      expect(response.body).toHaveProperty("totalHeightsInInches");
      expect(response.body.characters[0].gender).toBe("male");
      expect(response.statusCode).toBe(200);
    }
  );
});

describe("Testing the API Characters endpoint", () => {
  it(
    "Should return a JSON object containing list all female characters sorted by names " +
      "in ascending order",
    async () => {
      const response = await request(app).get(
        "/api/characters/female/name/ASC"
      );
      expect(response.body.characters.length).toBe(2);
      expect(response.body.characters.length).toEqual(
        response.body.totalCharacters
      );
      expect(response.body).toHaveProperty("characters");
      expect(response.body).toHaveProperty("totalCharacters");
      expect(response.body).toHaveProperty("totalHeightsInCm");
      expect(response.body).toHaveProperty("totalHeightsInInches");
      expect(response.body.characters[0].gender).toBe("female");
      expect(response.statusCode).toBe(200);
    }
  );
});

describe("Testing the API Comment endpoint", () => {
  it("Should return a JSON object containing list of all comments.", async () => {
    const response = await request(app).get("/api/comments/0");
    const comments = response.body[0];

    expect(Object.keys(comments)[0]).toBe("comment");
    expect(Object.keys(comments)[1]).toBe("ipAddress");
    expect(Object.keys(comments)[2]).toBe("createdAt");
    expect(response.statusCode).toBe(200);
  });
});

describe("Testing the API Comment endpoint", () => {
  it("Should return the newly created comment", async () => {
    const response = await request(app).post("/api/comment/").send({
      movieid: "60eb6d5a1bc70e48d0ssdsd",
      words: "Posting again comment for a movie",
      ipaddress: "123.456.789.111",
    });

    expect(response.body).toHaveProperty("views");
    expect(response.body).toHaveProperty("likes");
    expect(response.body).toHaveProperty("dislikes");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("movie");
    expect(response.body).toHaveProperty("words");
    expect(response.body).toHaveProperty("ipAddress");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body.movie).toBe("60eb6d5a1bc70e48d0ssdsd");
    expect(response.body.words).toBe("Posting again comment for a movie");
    expect(response.body.ipAddress).toBe("123.456.789.111");
    expect(response.statusCode).toBe(200);
  });
});
