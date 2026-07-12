import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/index.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyAccessToken(token);

  req.user = payload;

  next();
}
