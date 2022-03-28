// 注意：每次调用get()和post请求
// 会先调用ajaxPrefilter这个函数
// 这个函数中可以拿到我们提供的ajax提供的配置对象
$.ajaxPrefilter((options) => {
  // 发起请求前拼接路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
})
