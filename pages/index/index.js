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
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log('初次加载的数据：',res.data);
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
        console.log('上拉加载的数据：', res.data);
       
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
    console.log('登录状态：' ,isLogin);
    console.log('用户信息：',user);

    if(isLogin == "Y"){
      
      //获取设备信息
      wx.getSystemInfo({
        success: function (res) { 
          that.setData({
            equipment:res.model
          });
        },
      });

      //获取当前时间戳
      var date = new Date();
      var time = date.getTime();

      console.log('当前时间戳：',time);
      
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
          return res.data;
        },
        fail:(res)=>{
          return res.data;
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

      //使用随机数判断是否弹出问卷 几率：50%
      let ran = parseInt(Math.random() * 2);

      console.log('随机数：',ran);

      if (ran == 0) {

        //延迟2秒
        setTimeout(() => {

          //查询该用户是否已经拒绝或填写过
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

              //true：已填写或拒绝 false：未填写
              console.log(res.data);

              if (!res.data){

                wx.showModal({
                  title: '邀您填写调查问卷',
                  content: '将“遇见书画”打造成一个拥有极致用户体验的小程序需要我们的不懈努力，更需要您宝贵的意见和建议，我们诚挚的邀请您参与用户体验调查问卷。',
                  cancelText:'不了',
                  confirmText:'好的',
                  success(res) {

                    //确认跳转到问卷页 否则修改用户状态为拒绝
                    if (res.confirm) {  
                      wx.navigateTo({
                        url: "../questionnaire/questionnaire",
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
                          return res.data;
                        }
                      });
                    }
                  },
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
})