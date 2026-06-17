import mongoose from "mongoose";
import { User } from "../users/user.model.js";
import { Course } from "./course.model.js";
import { Order } from "../orders/order.model.js";
import { HttpError } from "../../shared/http-error.js";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function createCourse(data: {
  title: string;
  price: number;
  seatsLeft: number;
}) {
  return Course.create(data);
}

/**
 * UNSAFE version (Step 2).
 * Flow: read -> check -> (delay) -> write.
 * Problem: between the read and the write, another request reads the SAME
 * stale value. Both requests think "a seat is available".
 */
export async function buyCourseUnsafe(courseId: string, userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");

  const course = await Course.findById(courseId);
  if (!course) throw new HttpError(404, "Course not found");

  if (course.seatsLeft <= 0) throw new HttpError(400, "No seats left");
  if (user.balance < course.price) throw new HttpError(400, "Not enough balance");

  await delay(50);

  user.balance -= course.price;
  course.seatsLeft -= 1;

  await user.save();
  await course.save();

  await Order.create({
    userId: user._id,
    courseId: course._id,
    price: course.price,
    status: "paid",
  });

  return { message: "Course purchased", seatsLeft: course.seatsLeft };
}

/**
 * SAFE version (Step 4).
 * 1) Transaction — all or nothing (rolls back on any error).
 * 2) Atomic conditional update — "change only if the condition holds",
 *    without a separate read-then-write gap.
 */
export async function buyCourseSafe(courseId: string, userId: string) {
  const session = await mongoose.startSession();
  try {
    let resultSeats = 0;

    await session.withTransaction(async () => {
      const seat = await Course.updateOne(
        { _id: courseId, seatsLeft: { $gt: 0 } },
        { $inc: { seatsLeft: -1 } },
        { session }
      );
      if (seat.matchedCount === 0)
        throw new HttpError(400, "No seats left");

      const course = await Course.findById(courseId).session(session);
      const price = course!.price;

      const pay = await User.updateOne(
        { _id: userId, balance: { $gte: price } },
        { $inc: { balance: -price } },
        { session }
      );
      if (pay.matchedCount === 0)
        throw new HttpError(400, "Not enough balance");

      await Order.create(
        [{ userId, courseId, price, status: "paid" }],
        { session }
      );

      resultSeats = course!.seatsLeft;
    });

    return { message: "Course purchased", seatsLeft: resultSeats };
  } finally {
    await session.endSession();
  }
}
