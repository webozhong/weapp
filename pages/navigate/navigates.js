// pages/navigate.js
var ws=0;
Page({
  data:{
    array:{},
    num:[],
    title:"",
    data:"",
    id:"",
    ws:0
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '遇见书画',
      desc: '遇见书画，遇见最美好的你！',
      path: '/pages/navigate/navigates?id='+that.data.id+'&act=1'
    }
  },
  onLoad:function(options){
    console.log(options);
    var that = this;
    var num=[];
    that.setData({
      title: options.title,
      data:options.data,
      id:options.id
    });
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'https://www.webozhong.com/weapp/api.php',
      data: {
        act:1,
        id:options.id
        },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success 
        var json=null;
        res.data.content=JSON.parse(res.data.content); 
        json=res.data.content
        console.log(json);
        for(var i=0;i<json.p.length;i++ ){//设置索引数组
          num.push(i)
          };
        that.setData( {  
          num:num,
          array:json
         });
          //获取屏幕信息
        wx.getSystemInfo({ 
            success: function (res) {
              ws = res.windowWidth-32;
              that.setData({
                ws:ws
              })
            } 
          })
                  
      },
      fail: function() {
        // fail
      },
      complete: function(res) {
        // complete
        }
      })
    },
})