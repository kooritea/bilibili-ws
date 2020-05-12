module.exports = {
  info: (msg, exInfo) => {
    let ex = "";
    if (exInfo) {
      exInfo.forEach((info) => {
        ex += `[${info}]`;
      });
    }
    console.log(`\x1B[36m[bilibili-ws]\x1B[0m${ex} ${msg}`);
  },
  warn: (msg, exInfo, errInfo) => {
    let ex = "";
    if (exInfo) {
      exInfo.forEach((info) => {
        ex += `[${info}]`;
      });
    }
    console.log(`\x1B[33m[bilibili-ws]\x1B[0m${ex} ${msg}`);
    if (errInfo) {
      console.warn(errInfo);
    }
  },
};
