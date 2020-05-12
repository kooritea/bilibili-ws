# bilibili-ws

自助 b 站弹幕服务器连接器
主程序负责保持与弹幕服务器的连接和解析弹幕数据，其他功能由插件提供。

自动加载 plugins 文件夹下的 js 文件，插件导出一个类，所有插件在程序启动时进行初始化，传入一个 ebus，ebus 目前只有一个 cmd 时间。

## 示例插件

```javascript
module.exports = class Test(){
  constructor(ebus){
    ebus.on('cmd',({message,roomInfo})=>{
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
       * }
      */
      switch(message.cmd){
        case 'WELCOME':
          console.log(`欢迎${message.data.uname}进入${roomInfo.nickanme}的房间`)
          break
        default:
          console.log(message)
      }
    })
  }
}

```
