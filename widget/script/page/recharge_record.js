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
        list: []
      }
    },
    filters: {
      state: function(state) {
        if (state === 1) {
          return '已充值'
        }
      }
    },
    methods: {
      getData: function() {
        $.ajax({
          url: BaseService.apiUrl + 'getczjl',
          data: {userid: MockData.userid},
          context: this
        }).done(function(res) {
          console.log(ParseJson(res.data))
          this.list = ParseJson(res.data)
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