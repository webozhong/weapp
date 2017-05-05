let app = getApp();
Page({
  data: {
    openid: "",
    userInfo: {},
    js_code: "",
    array: {
      id: [0, 1, 2, 3],
      changeColor: [false, false, false]
    }
  },
  onShareAppMessage: function () {
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/myadmin/myadmins'
    }
  },
  onLoad() {
    var that = this;
    app.getUserInfo(userInfo => {
      that.setData({
        userInfo: userInfo,
        color: "#fff"
      })

    })

    // app.getUserInfo();
    // var userInfo = wx.getStorageSync('userInfo');
    // that.setData({userInfo:userInfo.userInfo});
    // console.log(userInfo);
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
  //点击弹窗，是否拨打
  callPhone() {
    wx.showModal({
      title: '联系我们',
      content: '075523572397',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.makePhoneCall({
            phoneNumber: '075523572397',
            success: function (res) {

            },
            fail: function () {
            },
            complete: function () {
            }
          })
        }
      }
    })
  }
})