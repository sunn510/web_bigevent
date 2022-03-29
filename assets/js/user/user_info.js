$(function () {
  // 验证
  layui.form.verify({
    nickname: function (value) {
      if (value > 6) {
        return '名称必须在1-6个字符之间'
      }
    },
  })

  initUserInfo()

  // 初始化用户信息
  function initUserInfo() {
    // 发起请求
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status != 0) {
          layui.layer.msg('获取用户信息失败')
        }
        // 调用form.val给表单赋值
        layui.form.val('formUserInfo', res.data)
      },
    })
  }

  //重置用户信息
  $('#btnReset').on('click', function (e) {
    //阻止默认
    e.preventDefault()
    // 重新获取用户信息
    initUserInfo()
  })

  // 修改用户信息
  // 监听表单提交
  $('#formUserInfo').on('submit', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 发起请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: (res) => {
        // 判断是否修改成功
        if (res.status != 0) {
          return layui.layer.msg(res.message)
        }

        // 修改成功
        layui.layer.msg(res.message)

        // 调用index.js  getUserInfo()方法重新渲染头像名字
        window.parent.getUserInfo()
      },
    })
  })
})
