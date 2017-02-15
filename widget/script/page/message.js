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
        notice: {},
        hasNoReadNotice: false,
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
        Helper.openWin('chat_room', {targetId: targetId})
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
            // alert(JSON.stringify(ret.result))
          }
        })
        // $.ajax({
        //   url: BaseService.apiUrl + 'getXSchat',
        //   data: { userid: Helper.getUserId() }
        // }).done(function(res) {
        //   if (res.key === 'true') {
        //     self.list = ParseJson(res.data)
        //     console.log(ParseJson(res.data))
        //   }
        //   // alert(JSON.stringify(res))
        // })
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

apiready = function() {
  initPage()
}
