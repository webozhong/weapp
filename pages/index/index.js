var app = getApp();
var url = app.http + "api";
var currentPage = 0;
var key = true;
var totalPage = 1;
//初次加载列表
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
      success(res) {
        console.log(res,res.data);
        //console.log(1, res, currentPage, res.data.page);
        if(res.statusCode == 200){
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
        }else if(res.statusCode == 500){
          GetList(that);
          wx.startPullDownRefresh({
            success(res){
              console.log(res);
              wx.stopPullDownRefresh();
            }
          })    
        }
        
      },
    })
  }
}

//上拉后加载的新列表
var getNextList = function(that){
  if (key && currentPage < totalPage) {
    key = false;
    //请求服务器的数据
    wx.request({
      url: url,
      data: {
        page: currentPage
      },
      success(res) {
        console.log(res, res.data);
       
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
    getNextList(that);
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
      success(res) {
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

    //弹出授权窗口
    app.login();
    var isLogin = wx.getStorageSync("isLogin");
    var user = wx.getStorageSync("user");
    console.log(isLogin);
    console.log(user);

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
        },
        fail:(res)=>{
          console.log(res);
        }
      });


      //显示用户调查问卷的模态框
      /*
      延时两秒调用接口判断用户是否填写过问卷，返回:
      User reject:用户拒绝填写问卷
      0:用户允许且未填写新用户问卷，此时推送新用户问卷
      1:用户允许且已填写新用户问卷，此时推送老用户问卷
      2:表示用户问卷已经全部填写

      用户点击取消按钮时调用接口将用户保存为拒绝填写类型，返回：
      0:更新失败
      1:更新成功
      */

      //20%几率弹出
      let ran = parseInt(Math.random() * 5);
      console.log(ran);
      if (ran == 0) {
        setTimeout(() => {
          wx.request({
            url: app.http + "api/questionnaires",
            data: {
              openid: user.openId,
            },
            method: "GET",
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              console.log(res.data);
              if (res.data == 0) {
                wx.showModal({
                  title: '用户问卷调查',
                  content: '请您参与我们的问卷调查，让我们更加进步！',
                  success(res) {
                    console.log(res);
                    if (res.confirm) {
                      wx.navigateTo({
                        url: "../questionsNew/questionsNew",
                      });
                    } else {
                      wx.request({
                        url: app.http + "api/users/request",
                        data: {
                          openid: user.openId,
                        },
                        method: "POST",
                        header: { 'content-type': 'application/x-www-form-urlencoded' },
                        success(res) {
                          console.log(res);
                        }
                      });
                    }
                  },
                })
              } else if (res.data == 1) {
                wx.showModal({
                  title: '用户问卷调查',
                  content: '请您参与我们的问卷调查，让我们更加进步！',
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: "../questionsOld/questionsOld",
                      });
                    } else {
                      wx.request({
                        url: app.http + "api/users/request",
                        data: {
                          openid: user.openId,
                        },
                        method: "POST",
                        header: { "content-type": "application/x-www-form-urlencoded" },
                        success(res) {
                          console.log(res);
                        }
                      });
                    }
                  }
                })
              }
            }
          });
        }, 2000);
      }
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
    //在页面展示之后先获取一次数据
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







