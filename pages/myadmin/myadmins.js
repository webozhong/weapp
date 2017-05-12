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

  onLoad(){
    // var that = this;
    // app.getUserInfo(userInfo => {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
    //   wx.setStorageSync('userInfo', userInfo);
    // })
    // wx.request({
    //   url: 'https://www.webozhong.com/api/users/saveuserinfo',
    //   data: {
    //     openid : wx.getStorageSync('user').openid,
    //     nickName : wx.getStorageSync('userInfo').nickName,
    //     avatarUrl : wx.getStorageSync('userInfo').avatarUrl,
    //     gender : wx.getStorageSync('userInfo').gender, //性别 0：未知、1：男、2：女
    //     province : wx.getStorageSync('userInfo').province,
    //     city : wx.getStorageSync('userInfo').city,
    //     country : wx.getStorageSync('userInfo').country
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
    //   success: function(res){
    //     // success
    //     console.log(res.data);
    //   },
    //   fail: function(res) {
    //     console.log('保存用户信息失败');
    //   },
    //   complete: function(res){
    //     // complete
    //   }
    // })
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