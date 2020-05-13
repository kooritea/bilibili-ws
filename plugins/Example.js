module.exports = class Example {
  static disable = true;
  constructor(ebus) {
    ebus.on("cmd", ({ message, roomInfo }) => {
      // message
      // 结构因cmd不同而有所差别
      /**
       * {
       *    cmd: '',
       *    data?: '',
       *    info?: ''
       * }
       */
      // roomInfo
      // 该消息来自的房间信息
      /**
       * {
       *  roomid: '9389401', // 来自config
       *  meta: {},// 来自config
       *  nickname: '時雨羽衣Official'// 自动根据roomid获取
       *  _roomid: 9389401, // 用户填写的roomid可能是短id,这个必定是长id
          masterid: 主播uid
       * }
       */
      // switch (message.cmd) {
      //   case "WELCOME":
      //     console.log(
      //       `欢迎${message.data.uname}进入${roomInfo.nickanme}的房间`
      //     );
      //     break;
      //   default:
      //     console.log(message);
      // }
    });
  }
};
