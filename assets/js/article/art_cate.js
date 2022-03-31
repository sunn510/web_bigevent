$(function () {
  initArtCateList()
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 获取失败
        if (res.status != 0) {
          return layui.layer.msg('获取列表失败')
        }

        // 使用模板引擎
        var htmlStr = template('tbl-table', res)

        $('tbody').html(htmlStr)
      },
    })
  }

  // 弹出层索引
  var indexAdd = null
  $('#btnAddCatte').on('click', function () {
    indexAdd = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })

  // 通过代理的方式为form-add绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        // 添加失败
        if (res.status != 0) {
          return layui.layer.msg('添加失败')
        }

        // 重新获取信息列表
        initArtCateList()

        // 添加成功
        layui.layer.msg(res.message)
        // 根据索引关闭弹出层
        layui.layer.close(indexAdd)
      },
    })
  })

  var indexEdit = null
  //通过代理的方式给btn-edit添加点击事件
  $('tbody').on('click', '#btn-edit', function () {
    // 弹出修改文章信息层
    indexEdit = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })
    var id = $(this).attr('data-Id')
    // 发起请求获取分类数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 获取失败
        if (res.status != 0) {
          return layui.layer.msg('获取当前编辑数据失败')
        }
        // 获取成功将数据填入表单内
        layui.form.val('form-edit', res.data)
      },
    })
  })

  // 修改表单监听subit事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        // 修改失败
        if (res.status !== 0) return layui.layer.msg('修改文章失败')

        // 修改成功
        // 根据索引关闭弹出层
        layui.layer.close(indexEdit)
        // 弹窗
        layui.layer.msg('修改文章成功')
        // 更新列表数据
        initArtCateList()
      },
    })
  })

  //通过body代理给btn-del添加点击事件
  $('body').on('click', '#btn-del', function () {
    var id = $(this).attr('data-Id')
    // 提示是否删除
    layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
      //点击确定发起ajax请求
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          // 删除失败
          if (res.status != 0) return layui.layer.msg('删除失败')
          // 删除成功
          layui.layer.msg('删除成功')
          // 刷新信息页
          initArtCateList()
        },
      })
      layer.close(index)
    })
  })
})
