function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        list: []
      }
    },
    methods: {
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getFriends',
          data: {
            userid: MockData.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
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
