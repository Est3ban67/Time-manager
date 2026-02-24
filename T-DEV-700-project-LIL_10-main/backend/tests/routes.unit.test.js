import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock models and dependencies before importing routes
jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Clock.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

// Mock the authenticateToken middleware to attach a test user
jest.unstable_mockModule("../middleware/authMiddleware.js", () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, username: "testuser", role: "employee" };
    next();
  },
}));

// Import routers after mocks
const authRouter = (await import("../routes/auth.js")).default;
const userRouter = (await import("../routes/users.js")).default;
const clockRouter = (await import("../routes/clocks.js")).default;

// Import mocked modules for assertions
const User = (await import("../models/User.js")).default;
const Clock = (await import("../models/Clock.js")).default;
const bcryptModule = await import("bcrypt");
const bcrypt = bcryptModule.default || bcryptModule;

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/clocks", clockRouter);

describe("Route unit tests (mocked DB)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Auth route - POST /api/auth/login", () => {
    it("returns 400 when fields are missing", async () => {
      const res = await request(app).post("/api/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("returns 401 when user not found", async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nouser", password: "pwd" });
      expect(res.status).toBe(401);
    });

    it("returns 401 when password does not match", async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        username: "u",
        password: "hashed",
      });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "u", password: "bad" });
      expect(res.status).toBe(401);
    });

    it("returns token and user on success", async () => {
      const mockUser = {
        id: 1,
        username: "u",
        password: "hashed",
        role: "admin",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "u", password: "good" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.username).toBe("u");
    });
  });

  describe("User routes", () => {
    it("GET /api/users returns list when authenticated", async () => {
      const users = [{ id: 1, username: "u1" }];
      User.findAll.mockResolvedValue(users);

      const res = await request(app)
        .get("/api/users")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /api/users returns 400 when missing fields", async () => {
      const res = await request(app).post("/api/users").send({ username: "a" });
      expect(res.status).toBe(400);
    });

    it("POST /api/users prevents duplicate username", async () => {
      User.findOne.mockResolvedValue({ id: 1, username: "exists" });
      const res = await request(app)
        .post("/api/users")
        .send({ username: "exists", password: "pwd" });
      expect(res.status).toBe(400);
    });

    it("POST /api/users creates user on success", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpwd");
      User.create.mockResolvedValue({
        id: 2,
        username: "new",
        role: "employee",
      });

      const res = await request(app)
        .post("/api/users")
        .send({ username: "new", password: "pwd" });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(2);
    });

    it("GET /api/users/profile returns user info", async () => {
      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(1);
    });
  });

  describe("Clock routes", () => {
    it("POST /api/clocks creates a new entry when none exists", async () => {
      Clock.findOne.mockResolvedValue(null);
      Clock.create.mockResolvedValue({ id: 1, userId: 1 });

      const res = await request(app)
        .post("/api/clocks")
        .set("Authorization", "Bearer x")
        .send({ date: "2026-01-09" });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/created/i);
    });

    it("POST /api/clocks updates when entry exists", async () => {
      Clock.findOne.mockResolvedValue({ id: 2, userId: 1, date: "2026-01-09" });
      Clock.update.mockResolvedValue([1]);

      const res = await request(app)
        .post("/api/clocks")
        .set("Authorization", "Bearer x")
        .send({ date: "2026-01-09", checkInMorning: "08:00:00" });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/updated/i);
    });

    it("GET /api/clocks returns not found when absent", async () => {
      Clock.findOne.mockResolvedValue(null);
      const res = await request(app)
        .get("/api/clocks?date=2026-01-09")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/not found/i);
    });

    it("POST /api/clocks/clock-in prevents double clock-in", async () => {
      Clock.findOne.mockResolvedValue({ id: 3, checkOut: null });
      const res = await request(app)
        .post("/api/clocks/clock-in")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(400);
    });

    it("POST /api/clocks/clock-in records clock-in when none open", async () => {
      Clock.findOne.mockResolvedValue(null);
      Clock.create.mockResolvedValue({
        id: 4,
        userId: 1,
        checkIn: new Date(),
        checkOut: null,
      });

      const res = await request(app)
        .post("/api/clocks/clock-in")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(201);
      expect(res.body.clock).toBeDefined();
    });

    it("POST /api/clocks/clock-out returns 400 when no open clock", async () => {
      Clock.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/clocks/clock-out")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(400);
    });

    it("POST /api/clocks/clock-out succeeds when open clock exists", async () => {
      const openClock = {
        id: 5,
        userId: 1,
        checkIn: new Date(Date.now() - 3600 * 1000),
        save: jest.fn(),
      };
      Clock.findOne.mockResolvedValue(openClock);

      const res = await request(app)
        .post("/api/clocks/clock-out")
        .set("Authorization", "Bearer x");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("workedHours");
    });
  });
});
