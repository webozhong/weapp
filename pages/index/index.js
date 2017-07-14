var app = getApp();
var url = app.http + "api";
var currentPage = 0;
var key = true;
var totalPage = 1;
var GetList = function (that) {
  if (key && currentPage < totalPage) {
    key = false;
    //请求服务器的数据
    wx.request({
      url: url,
      data: {
        page: currentPage
      },
      // header: {
      //   'content-type': 'application/json'
      // },
      success: function (res) {
        //console.log(1, res, currentPage, res.data.page);
        if (currentPage == res.data.page) {
          for (var i = 0; i < res.data.jsonObj.length; i++) {
            res.data.jsonObj[i].thumbnails = res.data.jsonObj[i].thumbnails.split(";");
          };
          var lists = that.data.list;
          totalPage = res.data.totalPage;
          for (var j = 0; j < res.data.jsonObj.length; j++) {
            lists.push(res.data.jsonObj[j]);
          }
          that.setData({
            list: lists,
          });
          currentPage++;
        }
      },
      fail: function () {
      },
    })
  }
}
Page({
  data: {
    hidden: true,
    key: true,
    list: [],
    hs: "",
    imgUrls: [],
    interval: 5000,
    duration: 1000,
    scrollTop: 0,
    floorstatus: null,
    userId:null,
    equipment:null,
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    key = true;
    GetList(that);
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ hidden: false });
    wx.request({
      url: url,
      data: {
        page: 0
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.jsonObj.length; i++) {
          res.data.jsonObj[i].thumbnails = res.data.jsonObj[i].thumbnails.split(";");
        };
        var lists = [];
        for (var j = 0; j < res.data.jsonObj.length; j++) {
          lists.push(res.data.jsonObj[j]);
        }
        that.setData({
          list: lists,
          hidden: true
        });
        //重置page的值保证刷新后的数据不丢失
        currentPage = 1;
        res.data.page = 1;
        console.log(res);
        // wx.showToast({
        //   title: '正在刷新',
        //   icon:"loading",
        //   duration:2000,
        //   mask:true,
        //   success:function(res){
        //     console.log(res);
        //   }
        // })
      },
    })
    wx.stopPullDownRefresh();
  },

  //页面的分享
  onShareAppMessage: function () {
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/index/index'
    }
  },

  onLoad: function (options) {
    var that = this;

    //弹出授权窗口
    app.login();
    var isLogin = wx.getStorageSync("isLogin");
    var user = wx.getStorageSync("user");
    console.log(isLogin);
    console.log(user.openId);

    if(isLogin == "Y"){
      
      //获取设备信息
      wx.getSystemInfo({
        success: function (res) { 
          that.setData({
            equipment:res.model
          });
        },
      });
      //获取当前时间
      var date = new Date();
      var time = date.getTime();
      console.log(typeof time,time)
      
      wx.request({
        url:app.http + "api/statistics/app",
        data:{
          openId:user.openId,
          equipment:that.data.equipment,
          time:time
        },
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
          console.log(res.data);
        }
      });
      
    }
    
    var h = 0;
    //获取屏幕信息  
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        h = res.windowHeight;
        that.setData({
          hs: h
        })
      }
    })
  },

  onShow: function () {
    //   在页面展示之后先获取一次数据
    var that = this;
    GetList(that);

  },
  //跳转到广告详情页面
  toAd:function(){
    wx.navigateTo({
      url: '../advertisement/advertisement',
    })
  }

  //回到顶部
  // backToTop: function () {
  //   this.setData({ scrollTop: 0 });
  //   // console.log(event);
  // },
  //滚动显隐回到顶部按钮
  // scrollTo: function (event) {
  //   if (event.detail.scrollTop > 1000) {
  //     this.setData({ floorstatus: true });
  //   } else {
  //     this.setData({ floorstatus: false });
  //   }
  // }
})
