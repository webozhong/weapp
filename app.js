//app.js
App({
  onLaunch: function (){
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://www.webozhong.com/api/users/login',
          data: {
            code: res.code,
          },
          success: function (res) {
            //获取openid
            var openid = JSON.parse(res.data).openid;
            //获取session_key
            var session_key = JSON.parse(res.data).session_key;
            //将用户openid和session_key信息存入Storage中方便读取
            var user = {};
            user.openid = openid;
            user.session_key = session_key
            wx.setStorageSync('user', user);
          },
          //fail or complete TODO
        })
      },
      //fail or complete TODO
    })
  },

  globalData: {
    userInfo: ""
  },
  getUserInfo: function (cb) {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      wx.login({
        success: res => {
          that.globalData.js_code = res.code;
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo;
              console.log(that.globalData.userInfo);
              var objz = {};
              objz.userInfo = res.userInfo;
              wx.setStorageSync('userInfo', objz)
              typeof cb == "function" && cb(that.globalData.userInfo);
            }
          })
        },
        fail: function () {
          wx.clearStorage();
        }
      })
    }
  }
})
// function ajaxUserInfo(url, data) {
//   var xhr = new XMLHttpRequest();
//   if (xhr) {
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
//     req.send(data);
//     req.onreadystatechange = function () {
//       if (req.readyState == 4) {
//         if (req.status == 200) {
//           console.log("success");
//         } else {
//           console.log("error");
//         }
//       }
//     }
//   }

// }