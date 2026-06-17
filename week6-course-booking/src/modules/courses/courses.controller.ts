import type { Request, Response } from "express";
import * as service from "./courses.service.js";

export async function createCourse(req: Request, res: Response) {
  const course = await service.createCourse(req.body);
  res.status(201).json(course);
}

export async function buyCourse(req: Request, res: Response) {
  const fn =
    req.query.mode === "unsafe" ? service.buyCourseUnsafe : service.buyCourseSafe;

  const courseId = req.params.courseId as string;
  const userId = req.body.userId as string;

  const result = await fn(courseId, userId);
  res.json(result);
}
