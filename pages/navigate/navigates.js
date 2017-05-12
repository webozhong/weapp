// pages/navigate.js
var ws = 0;
Page({
  data: {
    array: {},
    num: [],
    title: "",
    date: "",
    id: "",
    ws: 0,
    isCollection: "",
    isCollectionText: "",
    collNum:0
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/share/shares?id=' + that.data.id + '&act=1'
    }
  },
  onLoad: function (options) {
    //console.log(options);
    var that = this;
    var num = [];
    that.setData({
      id: options.id
    });
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
          num: num,
          array: json,
          date: res.data[0].sourceName+'·'+res.data[0].date,
          title: res.data[0].title
        });
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
    //获得用户对于这篇文章的收藏状态
    wx.request({
      url: 'https://www.webozhong.com/api/users/iscollection',
      data:{
        articleid: this.data.id,
        openid: wx.getStorageSync('user').openid
      },
      method:'POST',
      header: {'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
      success:function(res){
        if(res.data==1){
          that.setData({
            isCollection: 'y',
            isCollectionText: "已收藏",
          })
        }else{
          that.setData({
            isCollection: '',
            isCollectionText: "未收藏"
          })
        }
      }
    })

    //请求服务器返回该文章收藏总数
    wx.request({
      url: 'https://www.webozhong.com/api/users/collectionnum',
      data:{
        articleid: this.data.id,
      },
      method:"POST",
      header:{'content-type': 'application/x-www-form-urlencoded'},
      success:function(res){
        that.setData({
          collNum:res.data
        })
        //console.log(that.data.collNum)
      }
    })
  },

  //收藏按钮触发事件
  onclick: function () {
    if (this.data.isCollection == '') {
      this.setData({
        collNum: this.data.collNum + 1,
        isCollection: 'y',
        isCollectionText: "已收藏"
      })
      //请求服务器新增收藏记录
      wx.request({
        url: 'https://www.webozhong.com/api/users/saveusercollection',
        data: {
          articleid: this.data.id,
          openid: wx.getStorageSync('user').openid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
        success: function (res) {
          // success
          //console.log('savesuccess');
        },
      })
    } else {
      this.setData({
        collNum: this.data.collNum - 1,
        isCollection: '',
        isCollectionText: "未收藏"
      })
      //请求服务器删除收藏记录
      wx.request({
        url: 'https://www.webozhong.com/api/users/delusercollection',
        data: {
          articleid: this.data.id,
          openid: wx.getStorageSync('user').openid
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          //console.log(res.data);
        }
      })
    }
  }
})