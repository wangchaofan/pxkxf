/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {

      }
    },
    methods: {
      goPage: function(pageName) {
        api.openWin({
            name: pageName,
            url: 'widget://html/' + pageName + '.html',
            pageParam: {
                name: 'value'
            }
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