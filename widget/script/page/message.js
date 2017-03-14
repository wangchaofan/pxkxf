function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
      this.getNotice()
      this.getYytz()
    },
    data: function() {
      return {
        list: [],
        notice: {},
        yyNotice: {},
        hasNoReadNotice: true,
        uid: Helper.getUserId()
      }
    },
    filters: {
      json: function(val, key) {
        return JSON.parse(val)[key]
      }
    },
    methods: {
      onClickMessage: function(msg) {
        var targetId = msg.senderUserId === this.uid ? msg.targetId : msg.senderUserId;
        msg.unreadMessageCount = 0;
        Helper.openWin('chat_room', {targetId: targetId})
      },
      getNotice: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'gettz',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          var data = ParseJson(res.data)
          self.notice = data[0]
          self.hasNoReadNotice = _.every(data, function(o) { 
            return o.state == '2'
          })
          console.log(ParseJson(res.data))
        })
      },
      updateSysNoticeStatus: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'updategettz',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          if (res.key == 'true') {
            self.hasNoReadNotice = true
            Helper.openWin('notice')
          }
        })
      },
      getData: function() {
        var self = this
        var rong = api.require('rongCloud2');

        rong.getConversationList(function(ret, err) {
          if (ret.status === 'success') {
            self.list = _.map(ret.result, function(msg) {
              var extra = ParseJson(msg.latestMessage.extra)
              if (!extra.sender) {
                extra.sender = {};
                extra.receiver = {};
              }
              msg.latestMessage.extra = extra;
              return msg;
            });
          }
        })
      },
      handleReadyynotice: function(item) {
        if (item.state == 2) {
          Helper.openWin('order_detail', {id: item.dataId})
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'updateyytz',
          data: {
            tzid: item.noticeid
          }
        }).then(function(res) {
          if (res.key == 'true') {
            item.state = 2
          } else {
            api.toast({msg: res.mage})
          }
        })
      },
      handleDeleteYynotice: function(item, index) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'deleteyytz',
          data: {
            tzid: item.noticeid
          }
        }).then(function(res) {
          if (res.key == 'true') {
            self.yyNotice.splice(index, 1)            
          } else {
            api.toast({msg: res.mage})
          }
        })
      },
      getYytz: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getyytz',
          data: { userid: Helper.getUserId() }
        }).then(function(res) {
          self.yyNotice = ParseJson(res.data)
          console.log(ParseJson(res.data))
        }, function(err) {
          alert(JSON.stringify(err))
        })
      }
    }
  })
}

apiready = function() {
  initPage()
}
