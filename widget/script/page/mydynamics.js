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
      viewDetail: function(item) {
        api.openWin({
            name: 'dynamic_detail',
            url: 'widget://html/dynamic_detail.html',
            pageParam: {
                id: item.dynamicsId
            }
        });
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getDynamics',
          data: {userid: Helper.getUserId()}
        }).done(function(res) {
          self.list = ParseJson(res.data)
          console.log(ParseJson(res.data))
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
