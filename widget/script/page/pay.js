function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        order: {
          Skillmodel: [{}]
        },
        userModel: {
        },
        reason: ''
      }
    },
    methods: {
      onClickChat: function() {

      },
      toPay: function () {

      },
      onCancel: function () {
        api.prompt({
          buttons: ['确定', '取消']
        }, function(ret, err) {
          var index = ret.buttonIndex;
          var text = ret.text;
          alert(ret.text)
        })
        return
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'qxyydd',
          data: {
            userid: Helper.getUserId(),
            ddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a02',
            reason: ''
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var data = ParseJson(res.data)
            self.order = data[0]
            self.userModel = data[0].usermodel[0]
            console.log(ParseJson(res.data))
          }
        })
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'yyskillddinfo',
          data: {
            // skillddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a02'
            skillddid: api.pageParam.id
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var data = ParseJson(res.data)
            self.order = data[0]
            self.userModel = data[0].usermodel[0]
            console.log(ParseJson(res.data))
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
