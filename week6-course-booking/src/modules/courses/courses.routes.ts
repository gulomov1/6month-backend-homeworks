import { Router } from "express";
import * as controller from "./courses.controller.js";
import { Course } from "./course.model.js";

export const coursesRouter = Router();

coursesRouter.post("/", controller.createCourse);

coursesRouter.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

coursesRouter.post("/:courseId/buy", controller.buyCourse);
