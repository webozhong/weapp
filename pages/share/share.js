var ws = 0;
Page({
  data: {
    array: {},
    num: [],
    title: "",
    date: "",
    id: "",
    ws: 0,
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/share/share?id=' + that.data.id
    }
  },
  onLoad: function (options) {
    var that = this;
    var num = [];
    that.setData({
      id: options.id
    });
    console.log(that.data);
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://www.webozhong.com/api/index/getarticleinfo',
      data: {
        id: that.data.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {

        var json = null;
        res.data[0].content = JSON.parse(res.data[0].content);
        json = res.data[0].content
        for (var i = 0; i < json.p.length; i++) {//设置索引数组
          num.push(i)
        };
        that.setData({
          date: res.data[0].sourceName + '·' + res.data[0].date,
          title: res.data[0].title,
          num: num,
          array: json
        });
        console.log(res.data);
        //获取屏幕信息
        wx.getSystemInfo({
          success: function (res) {
            ws = res.windowWidth - 32;
            that.setData({
              ws: ws
            })
          }
        })
      },
    })
  }
})