console.log("start");

async function foo1() {
  console.log("A");
  await foo2();
  console.log("B");
}

async function foo2() {
  console.log("C");
}

setTimeout(() => {
  console.log("D");
}, 0);

foo1();

new Promise((resolve) => {
  console.log("E");
  resolve();
}).then(() => {
  console.log("F");
});

console.log("end");

result is 
start
A
C
E
end
B
F
D


1. `async` makes a function **return a Promise**; it does **not** make its entire body asynchronous.
2. An `async` function executes **synchronously until the first `await`**.
3. Therefore `fool()` starts immediately → prints `A`, calls `foo2()`, and `foo2()` immediately prints `C`.
4. `foo2()` finishes and returns a resolved Promise; `await` then **pauses `fool()`** and schedules its continuation (`B`) as a microtask.
5. The global/script stack continues → Promise executor prints `E`, `.then()` queues `F`, then `end` prints.
6. **Only after the current stack (including the global/script frame) is empty** are microtasks processed → `B`, then `F`.
7. After microtasks are exhausted, the timer runs → `D`; final order: **`start → A → C → E → end → B → F → D`**.
