import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["paid", "failed"], default: "paid" },
  },
  { timestamps: true } 
);

export const Order = model("Order", orderSchema);
