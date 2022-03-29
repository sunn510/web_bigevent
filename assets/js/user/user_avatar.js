$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 上传
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  $('#file').on('change', function (e) {
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layui.layer.msg('请选择图片')
    }
    // 1达到文件
    var file = e.target.files[0]
    // 2将文件转为url
    var imgURL = URL.createObjectURL(file)
    console.log(imgURL)
    // 3重新初始化裁剪区
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 为确定按钮绑定点击事件
  $('#btnUpload').on('click', function () {
    // 1.获取客户裁剪后的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL('image/png')
    // 2.调用上传接口
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success: function (res) {
        // 判断是否上传成功
        if (res.status !== 0) {
          return layui.layer.msg('上传失败')
        }

        // 成功弹窗并调用index.js
        layui.layer.msg('头像上传成功')

        window.parent.getUserInfo()
      },
    })
  })
})
