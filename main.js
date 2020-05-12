const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

const BilibiliWebSocket = require("./BilibiliWebSocket");
const Logger = require("./logger");
const Config = require("./config");
const { getNickname, getLongRoomid } = require("./bilibili-api");
const ebus = new EventEmitter();
const Rooms = [];
const Plugins = [];
const pluginsPath = fs.readdirSync(path.join(__dirname, "./plugins"));

for (let pluginName of pluginsPath) {
  try {
    const Plugin = require(`./plugins/${pluginName}`);
    if (typeof Plugin === "function") {
      Plugins.push(new Plugin(ebus));
    }
  } catch (e) {
    Logger.warn(`插件${pluginName}加载失败`);
  }
}

for (let roomInfo of Config.rooms) {
  getLongRoomid(roomInfo.roomid)
    .then((roomid) => {
      getNickname(roomid)
        .then((nickname) => {
          roomInfo.nickname = nickname;
          const Room = new BilibiliWebSocket(ebus, roomInfo);
          Room.start()
            .then(() => {
              Rooms.push(Room);
              Logger.info(
                `连接房间: ${nickname}-${roomInfo.roomid}${
                  String(roomInfo.roomid) === String(roomid)
                    ? ""
                    : "(" + roomid + ")"
                }`
              );
            })
            .catch((e) => {
              Logger.warn("房间连接失败", [roomInfo.roomid], e);
            });
        })
        .catch((e) => {
          Logger.warn("房间信息获取失败", [roomInfo.roomid], e);
        });
    })
    .catch((e) => {
      Logger.warn("短房间号信息获取失败", [roomInfo.roomid], e);
    });
}
