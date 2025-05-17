function allPromise(promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      return reject(new Error("Params is not an array"));
    }

    const results = [];
    let completed = 0;

    if (promiseArray.length === 0) {
      return resolve([]);
    }

    promiseArray.forEach((promiseValue, index) => {
      Promise.resolve(promiseValue)
        .then((value) => {
          results[index] = value; // ✅ preserve order
          completed++;

          if (completed === promiseArray.length) {
            resolve(results); // ✅ only resolve when all are done
          }
        })
        .catch(reject); // ✅ reject immediately if any fail
    });
  });
}

// Test it
let p1 = Promise.resolve(1);
let p2 = Promise.reject("error");
let p3 = Promise.resolve(3);

allPromise([p1, p2, p3])
  .then(results => console.log("Results:", results))
  .catch(error => console.error("Caught:", error));
