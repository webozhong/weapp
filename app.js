
App({
  /**
   * 全局登录方法，这里会调用wx.setStorageSync接口并设置2个值 user,isLogin
   * user 保存用户包括敏感信息如openId,appId在内的所有信息，只在用户确定登录后可用
   * isLogin 用来判断用户的登录状态以及做过哪些登录请求
   * isLogin == null 代表用户从未调起用wx.login接口，此时用户未登录
   * isLogin == "N"  代表用户调起过wx.login接口但是点击了拒绝，此时用户仍然未登录
   * isLogin == "Y"  代表用户通过wx.login接口或者wx.openSetting接口同意了登录授权，此时user值可用
   */
  http: "https://www.webozhong.com/",
  //http: "http://site.app/",
  data: {
    userId: null,
    equipment: null,
  },
  login: function () {
    let that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (data) {
            var rawData = data.rawData;
            var signature = data.signature;
            var encryptedData = data.encryptedData;
            var iv = data.iv;
            wx.setStorageSync('isLogin', 'Y');
            wx.request({
              url: that.http + 'api/users/login',
              data: {
                code: code,
                rawData: data.rawData,
                signature: data.signature,
                encryptedData: data.encryptedData,
                iv: data.iv,
              },
              method: "POST",
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                //将用户信息同步保存到全局user中
                var user = JSON.parse(res.data);
                wx.setStorageSync('user', user);
                wx.request({
                  url: that.http + 'api/users/saveuserinfo',
                  data: {
                    openid: user.openId,
                    nickName: user.nickName,
                    avatarUrl: user.avatarUrl,
                    gender: user.gender, //性别 0：未知、1：男、2：女
                    province: user.province,
                    city: user.city,
                    country: user.country
                  },
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {

                  }
                })
              }
            })
          },
          fail: function (res) {
            //用户拒绝登录授权，设置全局登录标识
            wx.setStorageSync('isLogin', 'N');
          }
        })
      }
    })
  },

  /**
   * 由于wx.login接口在10分钟内只能调用一次，而且不能在代码
   * 中清空授权信息以达到再次调起登录的效果，所以在用户第一次
   * 拒绝授权的情况下选择调用wx.openSetting接口，此接口没有
   * 时间和次数限制，但是要读取用户的授权状态，授权状态在成功
   * 的回调函数的返回值res.authSetting中，详细参考官方文档
   */
  openSetting: function () {
    var that = this;
    wx.openSetting({
      success: function (res) {
        var info = res.authSetting;
        if (info['scope.userInfo'] == true) {
          that.login();
        }
      }
    })
  },
  onLaunch: function () {
    var that = this;
    //弹出授权窗口
    that.login();
    var isLogin = wx.getStorageSync("isLogin");
    var user = wx.getStorageSync("user");

    if (isLogin == "Y") {

      //获取设备信息
      wx.getSystemInfo({
        success: function (res) {
          that.data.equipment = res.model;
        },
      });
      
      wx.request({
        url: that.http + "api/statistics/app",
        data: {
          openId: user.openId,
          equipment: that.data.equipment,
          // time: time
        },
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          return res.data;
        }
      });
    }
  }
})
