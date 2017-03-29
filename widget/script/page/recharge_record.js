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
          data: {userid: Helpter.getUserId()},
          context: this
        }).done(function(res) {
          console.log(ParseJson(res.data))
          this.list = ParseJson(res.data)
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}