// Race condition test — uses Node 22 built-in fetch (no axios needed).
// Usage: node test-race.js [safe|unsafe]   (default: safe)
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

async function run() {
  console.log(`>>> MODE: ${MODE.toUpperCase()}`);

  // 1) Fresh test data: one 1-seat course + two users with enough balance.
  const { data: course } = await post("/courses", {
    title: "Race Test Course",
    price: 50000,
    seatsLeft: 1,
  });
  const { data: a } = await post("/users", { fullName: "User A", balance: 100000 });
  const { data: b } = await post("/users", { fullName: "User B", balance: 100000 });

  console.log(`Course: ${course._id} (initial seatsLeft: ${course.seatsLeft})`);

  // 2) Fire TWO buy requests AT THE SAME TIME (mode chosen via query string).
  const buy = `/courses/${course._id}/buy?mode=${MODE}`;
  const results = await Promise.allSettled([
    post(buy, { userId: a._id }),
    post(buy, { userId: b._id }),
  ]);

  // 3) Count the outcomes.
  let success = 0;
  let failed = 0;
  results.forEach((r) => {
    const out = r.value;
    if (out.status === 200) success++;
    else failed++;
    console.log(`  -> [${out.status}]`, JSON.stringify(out.data));
  });

  // 4) Final state: seatsLeft and the number of orders.
  const finalCourse = await (await fetch(`${BASE}/courses/${course._id}`)).json();
  const orders = await (await fetch(`${BASE}/orders?courseId=${course._id}`)).json();

  console.log("\n===== RESULT =====");
  console.log("Succeeded:    ", success);
  console.log("Rejected:     ", failed);
  console.log("Final seatsLeft:", finalCourse.seatsLeft);
  console.log("Orders created: ", orders.count);
}

run();
