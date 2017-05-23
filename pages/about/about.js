// pages/myadmin/about/abouts.js
Page({
  data: {},
  onLoad() {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  callPhone() {
    wx.showModal({
      title: '拨打电话',
      content: '075523572397',
      success: function (res) {
        if (res.confirm) {
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