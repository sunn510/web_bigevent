$(function () {
  var q = {
    pagenum: 1, //页码 默认为第一页
    pagesize: 2, //每页显示的数据 默认为两条
    cate_id: '', //分类的ID
    state: '', //文章的状态
  }

  // 时间补零
  function padZero(d) {
    return d > 9 ? d : '0' + d
  }

  // template定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    // 年
    var y = dt.getFullYear()
    // 月
    var m = padZero(dt.getMonth() + 1)
    // 日
    var d = padZero(dt.getDate())

    // 时
    var hh = padZero(dt.getHours())

    // 分
    var mm = padZero(dt.getMinutes())
    // 秒
    var ss = padZero(dt.getSeconds())
    // 拼接时间
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  initTable()
  initCate()

  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // 获取失败
        if (res.status != 0) return layui.layer.msg('获取列表数据失败')
        // 获取成功
        var htmlStr = template('tpl_list', res)

        $('tbody').html(htmlStr)

        // 调用渲染列表分页
        renderPage(res.total)
      },
    })
  }

  // 初始化分类方法
  function initCate() {
    $.ajax({
      mathod: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 判断是否获取成功
        if (res.status != 0) return layui.layer.msg('获取列表分类失败')
        // 调用template模板引擎
        var htmlStr = template('tpl_cate', res)
        // 渲染分类
        $('[name=cate_id]').html(htmlStr)
        //调用form.render 重新渲染的ui结构
        layui.form.render()
      },
    })
  }

  // 监听表单筛选提交事件
  $('#form-search').on('submit', function (e) {
    // 阻止表单的提交事件
    e.preventDefault()
    //给p添加选择的分类填入p对象
    q.cate_id = $('[name=cate_id]').val()
    q.state = $('[name=state]').val()
    // 根据最新的筛选数据更新列表
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    //调用layui laypage.render方法渲染分页结构
    layui.laypage.render({
      elem: 'pageBox', //分页容器id
      count: total, //总数据条数
      limit: q.pagesize, //每页显示多少数据
      curr: q.pagenum, //显示第几页
      limits: [2, 4, 6, 8, 10], //控制下拉选显示条数
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页控件
      // 分页发生切换时候触发
      jump: function (obj, first) {
        //  拿到每次点击当前的页数
        q.pagenum = obj.curr
        //  拿到每次选择的分页显示条数
        q.pagesize = obj.limit
        // 只有点击的了页码first就为undefined
        if (!first) initTable()
      },
    })
  }

  // 删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取文章的ID
    var id = $(this).attr('data-Id')
    // 弹窗询问
    layui.layer.confirm(
      '是否删除？',
      { icon: 3, title: '提示' },
      function (index) {
        // 点击确定发起删除文章请求
        $.ajax({
          method: 'GET',
          url: '/my/article/delete/' + id,
          success: function (res) {
            // 判断
            // 1.删除失败
            if (res.status != 0) return layui.layer.msg('删除失败')
            // 2.删除成功 弹窗
            layui.layer.msg('删除成功')
            // 当删除数据完成后 判断当前删除按钮是否只有一个 并且页码值不等于一的情况下让页码值减1
            if (len === 1) q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            // 刷新列表
            initTable()
          },
        })
        // 关闭弹窗
        layer.close(index)
      }
    )
  })

  // 点击编辑文章功能
  $('body').on('click', '.btn-edit', function () {
    // 拿到点击哪行的数据
    var id = $(this).attr('data-Id')
    location.href = '/article/art.edit.html?id=' + id
  })
})
