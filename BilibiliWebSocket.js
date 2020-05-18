const WebSocket = require("ws");
const TextEncoder = require("util").TextEncoder;
const TextDecoder = require("util").TextDecoder;
const textEncoder = new TextEncoder("utf-8");
const textDecoder = new TextDecoder("utf-8");

const encode = function (str, op) {
  const data = textEncoder.encode(str);
  const packetLen = 16 + data.byteLength;
  const buf = Buffer.alloc(packetLen);
  buf.writeInt32BE(packetLen, 0);
  buf.writeInt16BE(16, 4); // Header Length
  buf.writeInt16BE(1, 6); // Protocol Version
  buf.writeInt32BE(op, 8); // Operation
  buf.writeInt32BE(1, 12); // Sequence Id
  buf.set(data, 16);
  return buf;
};
const decode = function (buf) {
  const result = {
    packetLen: 0,
    headerLen: 0,
    ver: 0,
    op: 0,
    seq: 0,
    body: null,
  };
  result.packetLen = buf.readInt32BE(0);
  result.headerLen = buf.readInt16BE(4);
  result.ver = buf.readInt16BE(6);
  result.op = buf.readInt32BE(8);
  result.seq = buf.readInt32BE(12);
  if (result.op === 5) {
    result.body = [];
    let offset = 0;
    while (offset < buf.length) {
      const packetLen = buf.readInt32BE(offset + 0);
      const headerLen = buf.readInt16BE(offset + 4);
      const data = buf.slice(offset + headerLen, offset + packetLen);
      const body = JSON.parse(textDecoder.decode(data));
      result.body.push(body);
      offset += packetLen;
    }
  } else if (result.op === 3) {
    result.body = {
      count: buf.readInt32BE(16),
    };
  } else if (result.op === 8) {
    result.body = null;
  }
  return result;
};
module.exports = class BilibiliWebSocket {
  constructor(ebus, roomInfo, Logger) {
    this.ebus = ebus;
    this.roomInfo = roomInfo;
    this.Logger = Logger
    this.roomid = Number(roomInfo.roomid);
    this.ws = null;
    this.reconnectCount = 0;
  }
  async start() {
    if (isNaN(this.roomid) || !this.roomid) {
      throw "roomid error";
    }
    this.heartTimerId = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send("", 2);
      }
    }, 30000);
    this.connect();
  }
  connect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }
    this.ws = new WebSocket("wss://broadcastlv.chat.bilibili.com:2245/sub");
    this.ws.on("open", this.onopen.bind(this));
    this.ws.on("message", this.onmessage.bind(this));
    this.ws.on("close", this.onclose.bind(this));
    this.ws.on("error", this.onerror.bind(this));
  }
  send(data, op) {
    switch (typeof data) {
      case "object":
        this.ws.send(encode(JSON.stringify(data), op));
        break;
      default:
        this.ws.send(encode(data, op));
        break;
    }
  }
  onopen() {
    this.send(
      {
        roomid: this.roomid,
      },
      7
    );
  }
  onmessage(buffer) {
    let data = decode(buffer);
    switch (data.op) {
      case 3:
        // 心跳回应，人气值
        // { count: number }
        // this.ebus.emit("heart", data.body);
        break;
      case 5:
        // 这里body一定是数组
        for (let message of data.body) {
          // {cmd:''}
          this.ebus.emit("cmd", {
            message,
            roomInfo: this.roomInfo,
          });
        }
        break;
      case 8:
        // 连接成功
        // data === null
        this.reconnectCount = 0;
        break;
    }
  }
  onclose() {
    this.reconnectCount++;
    setTimeout(
      () => {
        this.connect();
      },
      this.reconnectCount < 5 ? 5000 : 600000
    );
  },
  onerror(e){
    this.Logger.warn("房间出错", [this.roomInfo.roomid], e);
    this.onclose()
  }
};
