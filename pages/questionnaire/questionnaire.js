let app = getApp();

Page({

  data: {
    disabled: true,
    q7:'未填写',
    q8:'未填写',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //单选题触发的事件
 radio(e) {
    let that = this;
    let option = JSON.parse(e.detail.value);

    //遍历赋值
    for (var item in option) {
      that.setData({
        [item]: option[item],
      });
    }
    console.log(that.data);

    selectAll(that);
  },
  //填空题
  completion1(e) {
    let that = this;
    that.setData({
      q7: e.detail.value,
    });
    console.log(that.data.q7);
  },
  completion2(e) {
    let that = this;
    that.setData({
      q8: e.detail.value,
    });
    console.log(that.data.q8);
  },


  //用户点击提交按钮时触发的事件
  submit(e) {
    let that = this;
    let user = wx.getStorageSync("user");
    console.log(user);
    wx.request({
      url: app.http + "api/questionnaires",
      data: {
        openid: user.openId,
        q1: that.data.q1,
        q2: that.data.q2,
        q3: that.data.q3,
        q4: that.data.q4,
        q5: that.data.q5,
        q6: that.data.q6,
        q7: that.data.q7,
        q8: that.data.q8,
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        console.log(res.data);
        wx.navigateBack({
          delta: 1,
        });
      }
    });
  }
})

//判断必选项是否已选，是则按钮可以点击，否则不能点击
let selectAll = function (that) {
  let option = that.data;
  if (option['q1'] && option['q2'] && option['q3'] && option['q4'] && option['q5'] && option['q6']) {
    //console.log("必填项已全部填写");
    that.setData({
      disabled: false,
    });
  } else {
    //console.log("必填项未全部填写");
    that.setData({
      disabled: true,
    });
  }
};
