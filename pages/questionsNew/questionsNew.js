

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    q1:null,
    q2:null,
    q3:null,
    q4:null,
    disabled:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //问题1选择答案时触发的事件
  change1(e){
    let that = this;
    that.setData({
      q1:e.detail.value,
    });
    console.log(that.data.q1);

    isAll(that);
  },

  //问题2选择答案时触发的事件
  change2(e){
    let that = this;
    that.setData({
      q2:e.detail.value,
    });
    console.log(that.data.q2);

    isAll(that);
  },

  //问题3选择答案时触发的事件
  change3(e){
    let that = this;
    that.setData({
      q3:e.detail.value,
    });
    console.log(that.data.q3);

    isAll(that);
    
  },

  //问题4用户填写内容时触发的事件
  change4(e){
    let that = this;
    that.setData({
      q4:e.detail.value,
    });
    console.log(that.data.q4);
  },


  //用户点击提交按钮时触发的事件
  submit(){
    let that = this;
    let user = wx.getStorageSync("user");
    wx.request({
      url:app.http + "api/questionnaires",
      data:{
        openid:user.openId,
        q1:that.data.q1,
        q2:that.data.q2,
        q3:that.data.q3,
        q4:that.data.q4,
        type:that.data.type,
      },
      method:"POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res){
        console.log(res.data);
        wx.navigateBack({
          delta: 1,
        });
      }
    });
  }
})


//判断前三个问题是否全选，若全选则提交按钮可以点击，若没有全选，则不能点击
let isAll = function(that){
  if (that.data.q1 && that.data.q2 && that.data.q3) {
    // console.log("三个问题全选了");
    that.setData({
      disabled: false,
    });
  } else if (!that.data.q1 || !that.data.q2 || !that.data.q3) {
    // console.log("至少有一个问题没有选");
    that.setData({
      disabled: true,
    });
  }
};
