$(function () {
  initCate()

  // 初始化富文本编辑器
  initEditor()

  //  加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 失败
        if (res.status !== 0) {
          return layui.layer.msg('初始化文章分类失败')
        }
        // 成功 调用模板引擎，渲染分类下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 记得调用form.render方法
        layui.form.render()
      },
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 点击选择文件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 监听coverFile   change事件
  $('#coverFile').on('change', function (e) {
    // 拿到用户选择的文件
    var file = e.target.files
    // 判断
    if (file.length === 0) return layui.layer.msg('请选择文件')
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file[0])
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义发布状态
  var art_state = '已发布'

  // 为存为草稿按钮绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '存为草稿'
  })

  // 监听表单submit提交事件
  $('#form-pub').on('submit', function (e) {
    // 1阻止默认提交行为
    e.preventDefault()
    // 2$(this)[0]试讲jquery的对象转为dom对象
    var fd = new FormData($(this)[0])
    // 3将文章的发布状态存到fd中
    fd.append('state', art_state)

    // 4将方面裁剪过后的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象存储到fd中
        fd.append('cover_img', blob)
        // 发表文章
        publishArticle(fd)
      })
  })

  // 定义发表文件方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 向服务器提交的是formData的数据必须添加一下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        // 失败
        if (res.status != 0) {
          layui.layer.msg('发表失败')
        }

        // 成功跳转
        location.href = '../article/art_list.html'
        // 移除index上的layui-this类名
        window.parent.$('.layui-this').removeClass('layui-this')
        // 给文章列表添加layui-this
        window.parent.$('.atr_list').addClass('layui-this')
      },
    })
  }
})
