function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        list: []
      }
    },
    methods: {

    }
  })
}
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
