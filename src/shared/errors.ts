import { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, ...err.data });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}
