function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var width=[];
var imageSize = {}; 
function imageUtil(e) { 
  imageSize = {}; 
  
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight/originalWidth;//图片高宽比 
  // console.log('originalWidth: ' + originalWidth) 
  // console.log('originalHeight: ' + originalHeight) 
 //获取屏幕宽 
 wx.getSystemInfo({ 
  success: function (res) { 
   var windowWidth = res.windowWidth;  
   var windowscale = originalWidth/windowWidth;//屏幕和图片宽比 
    imageSize.imageWidth = windowWidth;
    width.push (windowWidth);
    imageSize.imageHeight  = originalScale* windowWidth;     
  } 
 }) 
//  console.log('缩放后的宽: ' + imageSize.imageWidth) 
//  console.log('缩放后的高: ' + imageSize.imageHeight)
//  console.log(width)
//  console.log(imageSize) 
 return imageSize; 
} 
  
module.exports = { 
 imageUtil: imageUtil 
} 