/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        info: null
      }
    },
    methods: {
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getexpertuserinfo',
          data: {
            exuserid: '073cb677-da3b-45ad-8536-9030e3ac5375'
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.info = ParseJson(res.data)[0]
            console.log(ParseJson(res.data)[0])
          }
        })
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