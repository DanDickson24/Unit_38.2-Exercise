process.env.NODE_ENV = "test"; // Setting the test environment

const request = require("supertest");
const app = require("../app");
const { Client } = require("pg");

let client;

beforeAll(async () => {
  client = new Client();
  await client.connect();
});

afterAll(async () => {
  await client.end();
});

describe("Bookstore Routes", () => {
  // Test data
  const testBook = {
    isbn: "1234567890",
    title: "Test Book",
    author: "Test Author",
    pages: 200,
    language: "English",
    publisher: "Test Publisher",
    year: 2023,
  };

  describe("GET /books", () => {
    test("should return an array of books", async () => {
      const response = await request(app).get("/books");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.books)).toBe(true);
    });
  });

  describe("POST /books", () => {
    test("should create a new book", async () => {
      const response = await request(app).post("/books").send(testBook);
      expect(response.statusCode).toBe(201);
      expect(response.body.book.isbn).toBe(testBook.isbn);
      expect(response.body.book.title).toBe(testBook.title);
    });

    test("should return 400 Bad Request for invalid book data", async () => {
      const invalidBook = { ...testBook, isbn: null };
      const response = await request(app).post("/books").send(invalidBook);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT /books/:isbn", () => {
    test("should update an existing book", async () => {
      const updatedBook = { ...testBook, title: "Updated Book" };
      const response = await request(app)
        .put(`/books/${testBook.isbn}`)
        .send(updatedBook);
      expect(response.statusCode).toBe(200);
      expect(response.body.book.title).toBe(updatedBook.title);
    });

    test("should return 404 Not Found for non-existent book", async () => {
      const nonExistentISBN = "9876543210";
      const response = await request(app)
        .put(`/books/${nonExistentISBN}`)
        .send(testBook);
      expect(response.statusCode).toBe(404);
    });

    test("should return 400 Bad Request for invalid book data", async () => {
      const invalidBook = { ...testBook, pages: "invalid" };
      const response = await request(app)
        .put(`/books/${testBook.isbn}`)
        .send(invalidBook);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("DELETE /books/:isbn", () => {
    test("should delete an existing book", async () => {
      const response = await request(app).delete(`/books/${testBook.isbn}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Book deleted");
    });

    test("should return 404 Not Found for non-existent book", async () => {
      const nonExistentISBN = "9876543210";
      const response = await request(app).delete(`/books/${nonExistentISBN}`);
      expect(response.statusCode).toBe(404);
    });
  });
});

