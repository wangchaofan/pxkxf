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
      onClickMessage: function(mes) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'xxupdatestate',
          data: { xxid: mes.chatId }
        }).done(function(res) {
          if (res.key === true) {
            
          }
        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getXSchat',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          self.list = ParseJson(res.data)
          console.log(ParseJson(res.data))
        })
      },
      goNotice: function () {
        api.openWin({
          name: 'notice',
          url: 'widget://html/notice.html',
          pageParam: {

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
