var vm;
var rong;
var imageJson;
var IMAGE_REGXE = /(\[[\u4e00-\u9fa5]+])/g;
$.ajax({
  url: '../res/emotion/emotion.json',
  dataType: 'json',
  type: 'get',
  dataFilter: function(ret) {return ret},
  success: function(res) {
    imageJson = res
  }
})

function transformMessage(msg) {
  return msg.replace(IMAGE_REGXE, function(result) {
    var v = _.find(imageJson, { text: result});
    return '<img src=../res/emotion/"' + v.name + '".png />'
  })
}
function initPage() {
  rong = api.require('rongCloud2');
  vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.connect()
    },
    data: function() {
      return {
        userId: '',
        receiveMessages: []
      }
    },
    filters: {
      message: function(val) {
        return val.replace(IMAGE_REGXE, function(result) {
          var v = _.find(imageJson, { text: result});
          return '<img src="../res/emotion/' + v.name + '.png" />'
        })
      }
    },
    methods: {
      transformMessage: function(val) {
        return val.replace(IMAGE_REGXE, function(result) {
          var v = _.find(imageJson, { text: result});
          return '<img src="../res/emotion/' + v.name + '.png" />'
        })
      },
      connect: function() {
        var self = this
        api.showProgress({
          animationType: 'fade',
          title: '提示',
          text: '正在连接...',
          modal: false
        });
        //this.setReceiveMessageListener()
        Helper.getRongcloudToken().then(function(res) {
          rong.connect({
            token: res.data
          }, function(ret, err) {
            api.hideProgress()
            if (ret.status == 'success')
              self.userId = ret.result.userId
              self.getHistoryMessage()
              // api.toast({ msg: ret.result.userId });
          })
        }, function(err) {
          api.hideProgress()
          alert(JSON.stringify(err))
        })
      },
      setReceiveMessageListener: function() {
        var self = this
        api.toast({msg: 'setListener'})
        rong.setOnReceiveMessageListener(function(ret, err) {
          api.toast({msg: 'recevie 1111'})
          self.receiveMessages.push(ret.result.message)
          api.toast({ msg: JSON.stringify(ret.result.message) });
          api.toast({ msg: ret.result.message.left });
        })
      },
      getHistoryMessage: function() {
        var self = this
        rong.getHistoryMessages({
          conversationType: 'PRIVATE',
          targetId: this.userId,
          //oldestMessageId: 40,
          count: 20
        }, function(ret, err) {
          if (ret.status === 'success') {
            self.receiveMessages = ret.result
          }
          //api.alert({ msg: JSON.stringify(ret.result) });
        })
      },
      sendMessage: function(msg) {
        var self = this
        rong.sendTextMessage({
          conversationType: 'PRIVATE',
          targetId: this.userId,
          text: msg,
          extra: ''
        }, function(ret, err) {
          if (ret.status == 'prepare')
            api.toast({ msg: JSON.stringify(ret.result.message) });
          else if (ret.status == 'success')
            api.toast({ msg: ret.result.message.messageId });
          else if (ret.status == 'error')
            api.toast({ msg: err.code });
        });
      },
      sendImage: function() {

      }
    }
  })
}

function initChatbox() {
  var UIChatBox = api.require('UIChatBox');
  UIChatBox.open({
    placeholder: '',
    maxRows: 4,
    emotionPath: 'widget://res/emotion',
    texts: {
      recordBtn: {
        normalTitle: '按住说话',
        activeTitle: '松开结束'
      }
    },
    styles: {
      inputBar: {
        borderColor: '#ddd',
        bgColor: '#fff'
      },
      inputBox: {
        borderColor: '#ddd',
        bgColor: '#fff'
      },
      emotionBtn: {
        normalImg: 'widget://res/img/emotion_button.png'
      },
      extrasBtn: {
        normalImg: 'widget://res/img/extra_button.png'
      },
      keyboardBtn: {
        normalImg: 'widget://res/img/keybord_button.png'
      },
      recordBtn: {
          normalBg: '#c4c4c4',
          activeBg: '#999999',
          color: '#000',
          size: 14
      },
      indicator: {
          target: 'both',
          color: '#c4c4c4',
          activeColor: '#9e9e9e'
      }
    },
      extras: {
          titleSize: 10,
          titleColor: '#a3a3a3',
          btns: [{
              title: '图片',
              normalImg: 'widget://res/img/chatBox_album1.png',
              activeImg: 'widget://res/img/chatBox_album2.png'
          }, {
              title: '拍照',
              normalImg: 'widget://res/img/chatBox_cam1.png',
              activeImg: 'widget://res/img/chatBox_cam2.png'
          }]
      }
  }, function(ret, err) {
    if(ret.eventType === 'send') {
      vm.sendMessage(ret.msg)
    } else if (ret.eventType === 'clickExtras') {
      if (ret.index === 0) {
        vm.sendImage()
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
  initChatbox()
  initPage()
}
