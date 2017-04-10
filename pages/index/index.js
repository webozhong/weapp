var page = 0;
var url = "https://www.webozhong.com/weapp/api.php";
var key = true;
var pages = 1;
var GetList = function (that) {
  if (key && page < pages) {
    key = false;
    //请求服务器的数据
    wx.request({
      url: url,
      data: {
        act: 0,
        page: page
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        for (var i = 0; i < res.data.jsonObj.length; i++) {
          res.data.jsonObj[i].thumbnails = res.data.jsonObj[i].thumbnails.split(";");
        };
        var list = that.data.list;
        pages = res.data.totalPage
        for (var j = 0; j < res.data.jsonObj.length; j++) {
          list.push(res.data.jsonObj[j]);
        }
        page++;
        that.setData({
          list: list
        });
      },
      fail: function () {
      }
    })
  }
}
Page({
  data: {
    list: [],
    hs: "",
  },
  lower: function () {
    var that = this;
    key = true
    GetList(that);
  },
  onShareAppMessage: function () {
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/index/index'
    }
  },
  onLoad: function (options) {
    var that = this;
    var h = 0;
    //console.log(app.globalData)
    //获取屏幕信息  
    wx.getSystemInfo({
      success: function (res) {
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
})
