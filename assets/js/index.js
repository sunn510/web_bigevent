$(function () {
  getUserInfo()

  // 点击退出
  $('.btnLogout').on('click', function () {
    // 提示用户是否退出
    layui.layer.confirm(
      '确定退出登陆?',
      { icon: 3, title: '提示' },
      function (index) {
        //do something
        // 清空本地token
        localStorage.removeItem('token')
        // 调转登陆面
        location.href = './login.html'

        // 关闭询问框
        layer.close(index)
      }
    )
  })
})

// 获取客户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //localStorage.getItem || '' 表示获取到为真就返回参数一 获取到的是null为假返回空字符串
    // headres: { Authorization: localStorage.getItem || '' },

    success: (res) => {
      // 判断是否获取成功
      if (res.status != 0) {
        return layui.layer.msg('请登录')
      }
      // 获取成功渲染图片
      renderAvatar(res.data)
    },

    // 无论成功或者失败都会调用complate
    // complete: function (res) {
    //   //在complete回调函数中 可以使用res.responseJSON拿到服务器响应的数据
    //   if (res.responseJSON.status === 1) {
    //     //  清空token
    //     localStorage.removeItem('token')
    //     // 返回登陆页面
    //     location.href = './login.html'
    //   }
    // },
  })
}

// 渲染图片
function renderAvatar(user) {
  // 获取用户名字
  var name = user.nickname || user.username
  //替换欢迎用户名字
  $('#welcome').html('欢迎&nbsp&nbsp' + name)

  // 判断是否有头像没有则现实用户名字第一个字 并且是大写
  if (user.user_pic) {
    // 有头像隐藏文字头像 显示图片头像
    $('.layui-nav-img').attr('css', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 没有头像隐藏图片头像 显示文字头像
    $('.layui-nav-img').hide()
    $('.text-avatar').html(name[0].toUpperCase()).show()
  }

  $('.user_info,.user_avatar,.user_pwd').on('click', function () {
    // 获取到当前的点击的自定义属性
    var calssStr = $(this).attr('data-user')
    // 清除所有layui-this 类名
    $('.layui-this').removeClass('layui-this')
    // // 当前点击的添加layui-this类名
    $('.user_' + calssStr).addClass('layui-this')

    // 清除所有下拉类名
    $('.layui-nav-itemed').removeClass('layui-nav-itemed')
    // 给用户信息列添加layui-nav-itemed
    $('#lis_info').addClass('layui-nav-itemed')
  })
}
