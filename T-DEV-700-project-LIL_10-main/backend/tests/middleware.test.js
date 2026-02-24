import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/authMiddleware.js";

const JWT_SECRET = "test-secret-key";

describe("Auth Middleware - authenticateToken", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no authorization header is provided", () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("should return 401 if authorization header is empty", () => {
    req.headers.authorization = "";

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 403 if token format is invalid", () => {
    req.headers.authorization = "InvalidToken";

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 403 if token is invalid or tampered with", () => {
    req.headers.authorization = "Bearer invalid-token-xyz";

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should call next() if token is valid", () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should attach user data to request if token is valid", () => {
    const userData = { id: 1, username: "testuser" };
    const token = jwt.sign(userData, JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(1);
    expect(req.user.username).toBe("testuser");
  });

  it("should handle expired tokens correctly", () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, JWT_SECRET, {
      expiresIn: "-1s",
    });
    req.headers.authorization = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
