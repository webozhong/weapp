let app = getApp();
Page({
  data: {
    array: {
      id: [0, 1, 2, 3],
      changeColor: [false, false, false]
    },

    //设置头像昵称初始值
    user: {
      nickName: '点击登录',
      avatarUrl: '../../images/user.png'
    }
  },
  onLoad: function () {

  },
  onShow: function () {
    var isLogin = wx.getStorageSync('isLogin');
    var user = wx.getStorageSync('user');
    //console.log(user);
    if (isLogin == "Y") {
      this.setData({
        user: user,
      })
    }
  },
  //点击跳转
  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  },
  //点击变色
  touchstart(e) {
    let id = e.currentTarget.dataset.id
    var array = { id: [], changeColor: [] };
    for (var i = 0; i < this.data.array.id.length; i++) {
      if (id == this.data.array.id[i]) {
        array.id[i] = i;
        array.changeColor[i] = true;
      }
      else {
        array.id[i] = i;
        array.changeColor[i] = false;
      }
    }
    this.setData({
      array: array
    })
  },
  touchend(e) {
    var array = { id: [], changeColor: [] };
    for (var i = 0; i < this.data.array.id.length; i++) {
      array.id[i] = i;
      array.changeColor[i] = false;
    }
    this.setData({
      array: array
    })
  },
  //拨号
  // callPhone() {
  //   wx.showModal({
  //     title: '联系我们',
  //     content: '075523572397',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //         wx.makePhoneCall({
  //           phoneNumber: '075523572397',
  //           success: function (res) {

  //           },
  //           fail: function () {
  //           },
  //           complete: function () {
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  //点击头像栏的操作，如果未登录则调起登录
  onclick: function () {
    var that = this;
    var isLogin = wx.getStorageSync('isLogin');
    var user = wx.getStorageSync('user');
    console.log(isLogin, user);
    if (isLogin == "") {
      //console.log('用户未登录且未调起过app.login方法');
      app.login();
      setTimeout(function(){
        isLogin = wx.getStorageSync('isLogin');
        user = wx.getStorageSync('user');
        console.log(isLogin,user);
        if (isLogin == "Y") {
          that.setData({
            user: user
          });
        }
      },2600);
    }
    else if (isLogin == "N") {
      //console.log('用户调起过app.login方法,但是拒绝了授权');
      app.openSetting();
    }
    else if (isLogin == "Y") {
      //console.log('用户已经是登录状态了');
      this.setData({
        user: user
      })
    }
  }
})
