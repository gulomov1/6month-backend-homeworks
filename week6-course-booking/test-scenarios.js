// Runs every scenario against the chosen version.
// Usage: node test-scenarios.js [safe|unsafe]   (default: safe)
const BASE = "http://localhost:3000";
const MODE = process.argv[2] === "unsafe" ? "unsafe" : "safe";

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}
async function get(path) {
  return (await fetch(BASE + path)).json();
}

async function parallelBuy(courseId, userIds) {
  const url = `/courses/${courseId}/buy?mode=${MODE}`;
  const results = await Promise.allSettled(
    userIds.map((id) => post(url, { userId: id }))
  );
  return results.map((r) => r.value);
}

async function scenario(label, seats, userCount, balance = 100000) {
  const { data: course } = await post("/courses", {
    title: label,
    price: 50000,
    seatsLeft: seats,
  });
  const users = [];
  for (let i = 0; i < userCount; i++) {
    const { data: u } = await post("/users", {
      fullName: `User ${i + 1}`,
      balance,
    });
    users.push(u._id);
  }

  const outcomes = await parallelBuy(course._id, users);
  const success = outcomes.filter((o) => o.status === 200).length;
  const failed = outcomes.length - success;

  const finalCourse = await get(`/courses/${course._id}`);
  const orders = await get(`/orders?courseId=${course._id}`);

  console.log(`\n--- ${label} ---`);
  outcomes.forEach((o) => console.log(`  [${o.status}] ${JSON.stringify(o.data)}`));
  console.log(`  Succeeded: ${success} | Rejected: ${failed}`);
  console.log(`  Final seatsLeft: ${finalCourse.seatsLeft} | Orders: ${orders.count}`);
}

async function rollbackScenario() {
  // A course that costs more than the user can afford.
  const { data: course } = await post("/courses", {
    title: "Rollback test (price > balance)",
    price: 999999,
    seatsLeft: 3,
  });
  const { data: poor } = await post("/users", { fullName: "Poor", balance: 100 });

  const out = await post(`/courses/${course._id}/buy?mode=${MODE}`, {
    userId: poor._id,
  });
  const finalCourse = await get(`/courses/${course._id}`);
  const orders = await get(`/orders?courseId=${course._id}`);

  console.log(`\n--- Balance rollback ---`);
  console.log(`  [${out.status}] ${JSON.stringify(out.data)}`);
  console.log(`  seatsLeft (should stay 3): ${finalCourse.seatsLeft}`);
  console.log(`  Orders (should be 0):      ${orders.count}`);
}

async function run() {
  console.log(`>>> MODE: ${MODE.toUpperCase()}`);
  await scenario("2 parallel requests, 1 seat", 1, 2);
  await scenario("5 parallel requests, 1 seat", 1, 5);
  await rollbackScenario();
}

run();
