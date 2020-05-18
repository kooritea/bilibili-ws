const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

const BilibiliWebSocket = require("./BilibiliWebSocket");
const Logger = require("./logger");
const Utils = require("./utils");
const Config = require("./config");
const { getNickname, getLongRoomid, getMasterUid } = require("./bilibili-api");
const ebus = new EventEmitter();
const Rooms = [];
const Plugins = [];
const pluginsPath = fs.readdirSync(path.join(__dirname, "./plugins"));

(async function () {
  for (let roomInfo of Config.rooms) {
    try {
      const roomid = await getLongRoomid(roomInfo.roomid);
      const nickname = await getNickname(roomid);
      const masterid = await getMasterUid(roomid);
      roomInfo.nickname = nickname;
      roomInfo._roomid = roomid;
      roomInfo.masterid = masterid;
      const Room = new BilibiliWebSocket(ebus, roomInfo, Logger);
      await Room.start();
      Rooms.push(Room);
      Logger.info(
        `连接房间: ${nickname}-${roomInfo.roomid}${
          String(roomInfo.roomid) === String(roomid) ? "" : "(" + roomid + ")"
        }`
      );
      await Utils.sleep(5000);
    } catch (e) {
      Logger.warn("初始化房间失败", [roomInfo.roomid], e);
    }
  }
  for (let pluginName of pluginsPath) {
    try {
      const Plugin = require(`./plugins/${pluginName}`);
      if (typeof Plugin === "function") {
        if (!Plugin.disable) {
          Plugins.push(new Plugin(ebus, Config));
          Logger.info(`插件${pluginName}已加载`);
        }
      }
    } catch (e) {
      Logger.warn(`插件${pluginName}加载失败`, null, e);
    }
  }
})();
