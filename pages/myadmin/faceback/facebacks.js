// pages/logs/logss.js
Page({
  data:{
    disabled:true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  input:function(e){
    var that=this;
    if(e.detail.value){
      that.setData({
        disabled:false
      })
    }
    else{
      that.setData({
        disabled:true
      })
    }
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})