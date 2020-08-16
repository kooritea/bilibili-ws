class ExDate extends Date {
  toFormat(format) {
    return format.replace(/yyyy|MM|dd|HH|mm|ss|DD/g, (a) => {
      switch (a) {
        case "yyyy":
          return ExDate.tf(this.getFullYear());
        case "MM":
          return ExDate.tf(this.getMonth() + 1);
        case "mm":
          return ExDate.tf(this.getMinutes());
        case "dd":
          return ExDate.tf(this.getDate());
        case "HH":
          return ExDate.tf(this.getHours());
        case "ss":
          return ExDate.tf(this.getSeconds());
        case "DD":
          switch (this.getDay()) {
            case 1:
              return '星期一'
            case 2:
              return '星期二'
            case 3:
              return '星期三'
            case 4:
              return '星期四'
            case 5:
              return '星期五'
            case 6:
              return '星期六'
            case 0:
              return '星期日'
          }
      }
    });
  }
  static tf(i) {
    return (i < 10 ? "0" : "") + i;
  };
}

module.exports = {
  info: (msg, exInfo) => {
    let ex = "";
    if (exInfo) {
      exInfo.forEach((info) => {
        ex += `[${info}]`;
      });
    }
    console.log(`\x1B[36m${((new ExDate()).toFormat('yyyy-MM-dd HH:mm:ss'))}[bilibili-ws]\x1B[0m${ex} ${msg}`);
  },
  warn: (msg, exInfo, errInfo) => {
    let ex = "";
    if (exInfo) {
      exInfo.forEach((info) => {
        ex += `[${info}]`;
      });
    }
    console.log(`\x1B[33m${((new ExDate()).toFormat('yyyy-MM-dd HH:mm:ss'))}[bilibili-ws]\x1B[0m${ex} ${msg}`);
    if (errInfo) {
      console.warn(errInfo);
    }
  },
};
