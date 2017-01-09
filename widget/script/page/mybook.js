function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        list: [],
        param: {
          page: 1,
          per: 10
        }
      }
    },
    methods: {
      getData: function() {

      }
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
