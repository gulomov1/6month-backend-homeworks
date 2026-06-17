import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, required: true },
  balance: { type: Number, required: true, min: 0 },
});

export const User = model("User", userSchema);
