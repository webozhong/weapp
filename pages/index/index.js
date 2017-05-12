var app = getApp();
var url = "https://www.webozhong.com/api";
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
      header: {
        'content-type': 'application/json'
      },
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
    app.getUserInfo(userInfo => {
      that.setData({
        userInfo: userInfo,
        color: "#fff"
      })
      wx.setStorageSync('userInfo', userInfo);
    })
    wx.request({
      url: 'https://www.webozhong.com/api/users/saveuserinfo',
      data: {
        openid: wx.getStorageSync('user').openid,
        nickName: wx.getStorageSync('userInfo').nickName,
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
        gender: wx.getStorageSync('userInfo').gender, //性别 0：未知、1：男、2：女
        province: wx.getStorageSync('userInfo').province,
        city: wx.getStorageSync('userInfo').city,
        country: wx.getStorageSync('userInfo').country
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res.data);
      },
      fail: function (res) {
        console.log('保存用户信息失败');
      },
      complete: function (res) {
        // complete
      }
    })
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

  //回到顶部
  backToTop: function () {
    this.setData({ scrollTop: 0 });
    // console.log(event);
  },
  //滚动显隐回到顶部按钮
  scrollTo: function (event) {
    if (event.detail.scrollTop > 1000) {
      this.setData({ floorstatus: true });
    } else {
      this.setData({ floorstatus: false });
    }
  }
})
