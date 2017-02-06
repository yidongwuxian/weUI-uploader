$.weui = {};  
$.weui.alert = function(options){  
  options = $.extend({title: '警告', text: '警告内容'}, options);  
  var $alert = $('.weui_dialog_alert');  
  $alert.find('.weui_dialog_title').text(options.title);  
  $alert.find('.weui_dialog_bd').text(options.text);  
  $alert.on('touchend click', '.weui_btn_dialog', function(){  
    $alert.hide();  
  });  
  $alert.show();  
};  

$(function () {  
  // 允许上传的图片类型  
  var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
  // 1024KB，也就是 1MB  
  var maxSize = 1024 * 1024;  
  // 图片最大宽度  
  var maxWidth = 300;  
  // 最大上传图片数量  
  var maxCount = 6;  
  //上传文件
  var $uploaderFiles = $('.weui_uploader_files');
  //轮播图
  var $gallery       = $('#gallery');
  // 轮播图图片
  var $galleryImg    = $("#galleryImg");
  // 删除文件按钮
  var $delBtn        = $('.weui-icon-delete');


  $('.js_file').on('change', function (event) {  
    var files = event.target.files;  
    
      // 如果没有选中文件，直接返回  
      if (files.length === 0) {  
        return;  
      }  
      
      for (var i = 0, len = files.length; i < len; i++) {  
        var file = files[i];  
        var reader = new FileReader();  
          // 如果类型不在允许的类型范围内  
          if (allowTypes.indexOf(file.type) === -1) {  
            $.weui.alert({text: '该类型不允许上传'});  
            continue;  
          }  
          
          if (file.size > maxSize) {  
            $.weui.alert({text: '图片太大，不允许上传'});  
            continue;  
          }  
          
          
          reader.onload = function (e) {  
            var img    = new Image();  
            var time   = new Date().getTime();
            var fileid = "file"+time;
                img.onload = function () {  
                  // 不要超出最大宽度  
                  var w = Math.min(maxWidth, img.width);  
                  // 高度按比例计算  
                  var h = img.height * (w / img.width);  
                  var canvas = document.createElement('canvas');  
                  var ctx = canvas.getContext('2d');  
                  // 设置 canvas 的宽度和高度  
                  canvas.width = w;  
                  canvas.height = h;  
                  ctx.drawImage(img, 0, 0, w, h);  
                  var base64 = canvas.toDataURL('image/png');  
                  
                  // 插入到预览区  
                  var $preview = $('<li class="weui_uploader_file weui_uploader_status" id="'+fileid+'" style="background-image:url(' + base64 + ')"><div class="weui_uploader_status_content">0%</div></li>');  
                  $uploaderFiles.append($preview);  
                  var num = $('.weui_uploader_file').length;  
                  $('.js_counter').text(num + '/' + maxCount);  
                    

                  // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
                  
                 //点击已上传图片，打开轮播图
                  $('#'+fileid).on('click',function(){
                      var that = $(this);
                      $galleryImg.attr("style", this.getAttribute("style"));
                      $gallery.fadeIn(100);
                      delBtn(that);
                  })

                  //点击删除按钮，删除相应已上传图片
                  function delBtn(that){
                      $delBtn.on("click", function(){
                          //对应的图片删除
                          that.remove();
                          //删除后，重新计算当前剩余图片数量 start
                          var num = $('.weui_uploader_file').length;  
                          $('.js_counter').text(num + '/' + maxCount);  
                          //删除后，重新计算当前剩余图片数量 end
                      });
                  }
                  
                  //单击轮播图任何区域，隐藏界面 
                  $gallery.on("click", function(){
                      $gallery.fadeOut(100);
                  }); 

                  var progress = 0;  
                  function uploading() {  
                      $preview.find('.weui_uploader_status_content').text(progress++ + '%'); 
                        // 上传文件个数大于最大个数时，提示最多只能上传图片数量，清空图片和计数器
                        if($('.weui_uploader_file').length > maxCount) {  
                            $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});
                            $('.weui_uploader_files li').remove();
                            $('.js_counter').text(0 + '/' + maxCount);    
                            return false;  
                        }else{
                            // 进度小于100%时，上传继续
                            if (progress <= 100) {  
                              setTimeout(uploading, 30);  
                            }  
                            else{  
                              // 进度达到100%时，上传完毕，并当上传数量至少大于1时，提示文件上传成功
                              // 如果是失败，塞一个失败图标  
                              //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                              $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                              if($('.weui_uploader_file').length > 0){
                                  $.weui.alert({title: '提示', text: '文件上传成功！'}); 
                              }
                              
                            }  
                        } 
                        
                  } 
                  setTimeout(uploading, 30);  
                };  
                img.src = e.target.result;                           
              };  
          reader.readAsDataURL(file);  
        }  
      });    
});  