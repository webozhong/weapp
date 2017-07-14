// pages/navigate.js
let app = getApp();
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
    collNum: 0,
    startTime:0,
    endTime:0,
    duration:0
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
    var newDate = new Date();
    var startTime = newDate.getTime();
    that.setData({ startTime: startTime});
    console.log(options);
    
    var num = [];
    that.setData({
      id: options.id
    });
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.http + 'api/index/getarticleinfo',
      data: {
        id: that.data.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        var json = null;
        res.data[0].content = JSON.parse(res.data[0].content);
        json = res.data[0].content
        for (var i = 0; i < json.p.length; i++) {//设置索引数组
          num.push(i)
        };
        that.setData({
          num: num,
          array: json,
          date: res.data[0].sourceName + '·' + res.data[0].date,
          title: res.data[0].title
        });
        console.log(that.data.array.p[0].length);
        
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
      url: app.http + 'api/users/iscollection',
      data: {
        articleid: this.data.id,
        openid: wx.getStorageSync('user').openId
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            isCollection: 'y',
            isCollectionText: "已收藏",
          })
        } else {
          that.setData({
            isCollection: '',
            isCollectionText: "未收藏"
          })
        }
      }
    })

    //请求服务器返回该文章收藏总数
    wx.request({
      url: app.http + 'api/users/collectionnum',
      data: {
        articleid: this.data.id,
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.setData({
          collNum: res.data
        })
        //console.log(that.data.collNum)
      }
    })
  },
  //关闭页面时发送数据openId,articleId,duration
  onUnload:function(){
    var that = this;
    var newDate = new Date();
    var endTime = newDate.getTime();
    that.setData({ endTime: endTime});
    var duration = that.data.endTime - that.data.startTime;
    that.setData({duration:duration});
    var isLogin = wx.getStorageSync("isLogin");
    var user = wx.getStorageSync("user");

    if(isLogin == "Y"){
      wx.request({
        url: app.http + "api/statistics/article",
        data:{
          openId:user.openId,
          articleId:that.data.id,
          duration:that.data.duration
        },
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log(res);
        }
      });
    }
    console.log(that.data.endTime-that.data.startTime);
  },



  //收藏按钮触发事件
  onclick: function () {
    var isLogin = wx.getStorageSync('isLogin');
    var user = wx.getStorageSync('user');
    if (isLogin == "") {
      console.log('用户未登录且未调起过app.login方法');
      app.login();
    }
    else if (isLogin == "N") {
      console.log('用户调起过app.login方法,但是拒绝了授权');
      app.openSetting();
    } else if (isLogin == "Y"){
      if (this.data.isCollection == '') {
        this.setData({
          collNum: this.data.collNum + 1,
          isCollection: 'y',
          isCollectionText: "已收藏"
        })
        //请求服务器新增收藏记录
        wx.request({
          url: app.http + 'api/users/saveusercollection',
          data: {
            articleid: this.data.id,
            openid: wx.getStorageSync('user').openId
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
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
          url: app.http + 'api/users/delusercollection',
          data: {
            articleid: this.data.id,
            openid: wx.getStorageSync('user').openId
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
        })
      }
    }
  },
  touchImg: function (e) {
    var nowImgUrl = e.target.dataset.src;
    
    var that = this;
    var allArr = that.data.array.img;
    var imgArr = [];
    var length = allArr.length;
    for (var i = 0; i <= length; i++) {
      if (allArr[i] != 'empty.jpg' && allArr[i] != undefined) {
        imgArr.push('https://www.webozhong.com/originals/' + allArr[i]);
      }
    }
    //console.log(imgArr);
    wx.previewImage({
      current: nowImgUrl,
      urls: imgArr,
    })
  },

})
