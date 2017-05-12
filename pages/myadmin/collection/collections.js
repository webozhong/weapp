Page({
  data: {
    list: []
  },
  onLoad: function () {
   
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    wx.request({
      url: 'https://www.webozhong.com/api/users/collectionlist',
      data: {
        openid: wx.getStorageSync('user').openid,
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if(res.data!=that.data){
          that.setData({
            list: res.data,
          })
        }
        
      }
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  }
})
