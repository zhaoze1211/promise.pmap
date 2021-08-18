# 简介

处理前端并发任务，支持重试和重试时间间隔

## 安装
```
npm install promise.pmap --save

或者

yarn add promise.pmap
```

## 代码示例
```
import pmap from "promise.pmap";

//并发数
const concurrency = 3;

//reject后重试次数
const retry = 3;

//重试次数间隔时长，单位毫秒
const interval = 3000;

pmap(
  [1, 2, 3, 4, 5],
  (item, index, array) =>
    new Promise((resolve, reject) => {
      // do something
    }),
  concurrency,
  retry,
  interval
)
  .then((data) => {
    //成功
  })
  .catch((err) => {
    //异常
  });

```
