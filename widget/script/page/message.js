function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
      this.getNotice()
    },
    data: function() {
      return {
        list: [],
        notice: null,
        hasNoReadNotice: false
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
      getNotice: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'gettz',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          self.notice = ParseJson(res.data)[0]
          self.hasNoReadNotice = _.every(self.notice, function(o) { return o.state == '2'})
          console.log(ParseJson(res.data))
        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getXSchat',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
            console.log(ParseJson(res.data))
          }
          // alert(JSON.stringify(res))
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
