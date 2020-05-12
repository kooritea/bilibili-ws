const axios = require("axios").default;
module.exports = {
  async getNickname(roomid) {
    return (
      await axios.get(
        `https://api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room?roomid=${roomid}`,
        {
          headers: {
            Accept: "*/*",
            "User-Agent": "Mozilla/5.0 BiliDroid/5.37.0 (bbcallen@gmail.com)",
          },
        }
      )
    ).data.data.info.uname;
  },
  async getLongRoomid(roomid) {
    return (
      await axios.get(
        `https://api.live.bilibili.com/room/v1/Room/mobileRoomInit?id=${roomid}`,
        {
          headers: {
            Accept: "*/*",
            "User-Agent": "Mozilla/5.0 BiliDroid/5.37.0 (bbcallen@gmail.com)",
          },
        }
      )
    ).data.data.room_id;
  },
};
