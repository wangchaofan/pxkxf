function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        list: []
      }
    },
    methods: {
      toAdd: function() {
        api.openWin({
          name: 'add_dynamic',
          url: 'widget://html/add_dynamic.html',
          realod: true
        });
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
