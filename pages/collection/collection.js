let app = getApp();
Page({
  data: {
    list: []
  },
  onShow: function () {
    var isLogin = wx.getStorageSync('isLogin');
    var user = wx.getStorageSync('user');
    if (isLogin == "") {
      console.log('用户未登录且未调起过app.login方法');
      app.login();
    }
    else if (isLogin == "N") {
      console.log('用户调起过app.login方法,但是拒绝了授权');
      app.openSetting();
    } else if (isLogin == "Y") {
      var that = this;
      this.setData({
        user: wx.getStorageSync('user'),
      }),
        //用户已登录，请求收藏列表
        //此页未写上拉加载
        wx.request({
          url: 'https://www.webozhong.com/api/users/collectionlist',
          data: {
            openid: this.data.user.openId,
          },
          method: "POST",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data != 0) {
              console.log(res.data);
              that.setData({
                list: res.data,
                noLost: false
              })
            } else {
              that.setData({
                noList: true
              })
            }
          }
        })
    }
  }
})
