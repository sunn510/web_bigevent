$(function () {
  // 点击注册连接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击登陆连接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 通过 layui.form.verify函数自定义校验规则
  layui.form.verify({
    // 自定义一个叫pwd的校验规则
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (value !== pwd) {
        return '两次密码不一致'
      }
    },
  })

  // 监听注册表单的提交表单
  $('#form_reg').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    }
    // 发起ajax
    $.post('/api/reguser', data, function (res) {
      if (res.status != 0) {
        //弹出层
        return layui.layer.msg(res.message)
      }

      //弹出层
      layui.layer.msg(res.message)

      // 清除输出的内容
      $('#form_reg [name=username]').val('')
      $('#form_reg [name=password]').val('')
      $('#form_reg [name=repassword]').val('')

      // 触发点击事件 切换登陆
      $('#link_login').click()
    })
  })

  // 监听登陆表单提交事件
  $('#from_login').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    $.post('/api/login', $(this).serialize(), function (res) {
      //登陆失败
      if (res.status != 0) {
        return layui.layer.msg(res.message)
      }

      layui.layer.msg(res.message)
      // 登陆成功 将获取到的token存入localStroage
      localStorage.setItem('token', res.token)
      // 成功后跳转到首页
      location.href = './index.html'
    })
  })
})
