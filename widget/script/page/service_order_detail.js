function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        userid: Helper.getUserId(),
        ddid: api.pageParam.id,
        order: {
          Skillmodel: [{}]
        },
        userModel: null,
        reason: ''
      }
    },
    methods: {
      onClickChat: function() {
        Helper.openWin('chat_room', {targetId: this.userModel.lUserId})
      },
      // === 接受订单 ===
      onClickAccept: function () {
        var self = this
        api.confirm({
          title: '提示',
          msg: '是否确定接受？'
        }, function (ret, err) {
          if (ret.buttonIndex == 2) {
            $.ajax({
              url: BaseService.apiUrl + 'jsyydd',
              data: {
                ddid:  self.ddid
              }
            }).done(function(res) {
              if (res.key === 'true') {
                self.getData()
              } else {
                api.toast({msg: res.mage})
              }
            })
          }
        })
      },
      // === 拒绝 ===
      onClickRefuse: function() {
        var self = this
        api.confirm({
          title: '提示',
          msg: '是否确定拒绝？'
        }, function (ret, err) {
          if (ret.buttonIndex == 2) {
            $.ajax({
              url: BaseService.apiUrl + 'jjyydd',
              data: {
                ddid:  self.ddid
              }
            }).done(function(res) {
              if (res.key === 'true') {
                self.getData()
              } else {
                api.toast({msg: res.mage})
              }
            })
          }
        })
      },
      onClickComplete: function() {
        var self = this
        api.confirm({
          title: '提示',
          msg: '是否确定完成？'
        }, function (ret, err) {
          if (ret.buttonIndex == 2) {
            $.ajax({
              url: BaseService.apiUrl + 'gyddwc',
              data: {
                ddid: self.ddid
              }
            }).done(function(res) {
              if (res.key === 'true') {
                self.getData()
              } else {
                api.toast({msg: res.mage})
              }
            })
          }
        })
      },
      // === 评价 ===z
      toComment: function() {
        Helper.openWin('comment', {id: this.ddid, orderType: 'service'})
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'fwskillddinfo',
          data: {
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
apiready = function(){
  initPage()
}
