$(function () {
  layui.form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    newPwd: function (value) {
      if (value === $('.layui-form [name=oldPwd]').val()) {
        return '新密码不能是原密码'
      }
    },
    rePwd: function (value) {
      if (value !== $('.layui-form [name=newPwd]').val()) {
        return '新密码和确认密码不一致'
      }
    },
  })

  // 简体修改密码表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单提交默认行为
    e.preventDefault()

    // 发起请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        // 判断是否修改成功
        if (res.status !== 0) {
          return layui.layer.msg('密码修改失败')
        }
        // 成功
        layui.layer.msg(res.message)

        $('.layui-form')[0].reset()
      },
    })
  })
})
