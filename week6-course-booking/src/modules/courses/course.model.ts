import { Schema, model } from "mongoose";

const courseSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  seatsLeft: { type: Number, required: true, min: 0 }, 
});

export const Course = model("Course", courseSchema);
