// 注意：每次调用get()和post请求
// 会先调用ajaxPrefilter这个函数
// 这个函数中可以拿到我们提供的ajax提供的配置对象
$.ajaxPrefilter((options) => {
  // 发起请求前拼接路径
  options.url = 'http://www.liulongbin.top:3007' + options.url

  if (options.url.indexOf('/my/') != -1) {
    options.headers = { Authorization: localStorage.getItem('token') || '' }

    // 全局挂载complete回调函数
    options.complete = function (res) {
      //在complete回调函数中 可以使用res.responseJSON拿到服务器响应的数据
      if (res.responseJSON.status === 1) {
        //  清空token
        localStorage.removeItem('token')
        // 返回登陆页面
        location.href = './login.html'
      }
    }
  }
})
