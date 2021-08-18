/**
 * 处理并发任务，支持重试
 * @param {*} arr 数组
 * @param {*} fn 返回Promise的函数
 * @param {*} concurrency 并发数
 * @param {*} retry 重试次数
 * @returns
 */
module.exports = function pmap(arr, fn, concurrency, retry, interval) {
  concurrency = concurrency || Infinity;
  retry = retry || 0;
  interval = interval || 3000;
  if (typeof concurrency !== 'number') {
    throw new TypeError(String(concurrency) + ' is not a number');
  }
  if (typeof retry !== 'number') {
    throw new TypeError(String(retry) + ' is not a number');
  }
  if (typeof interval !== 'number') {
    throw new TypeError(String(interval) + ' is not a number');
  }

  return new Promise(function (resolve, reject) {
    let completed = 0;
    let started = 0;
    let running = 0;
    const results = new Array(arr.length);
    const cache = {};

    (function replenish() {
      if (completed >= arr.length) {
        return resolve(results);
      }

      while (running < concurrency && started < arr.length) {
        running++;
        started++;
        (function temp(index) {
          const cur = arr[index];
          Promise.resolve(fn.call(cur, cur, index, arr))
            .then(function (result) {
              running--;
              completed++;
              results[index] = result;
              delete cache[index];
              replenish();
            })
            .catch((err) => {
              cache[index] ? cache[index]++ : (cache[index] = 1);
              if (cache[index] < retry + 1) {
                setTimeout(() => {
                  temp(index);
                }, interval);
              } else {
                reject(err);
              }
            });
        })(started - 1);
      }
    })();
  });
};
