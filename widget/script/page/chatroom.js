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

function clearUnreadStatus() {
  rong.clearMessagesUnreadStatus({
    conversationType: 'PRIVATE',
    targetId: api.pageParam.targetId
  }, function(ret, err) {
    if (ret.status === 'success') {

    }
  })
}

function initPage() {
  rong = api.require('rongCloud2');
  clearUnreadStatus()
  vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getHistoryMessage();
      this.getUserInfo(Helper.getUserId(), 'user');
      if (!api.pageParam.avatar) {
        this.getUserInfo(api.pageParam.targetId, 'target');
      }
    },
    data: function() {
      return {
        userId: '',
        myInfo: {
          avatar: '',
          nickname: ''
        },
        targetInfo: {
          avatar: api.pageParam.avatar || '',
          nickname: api.pageParam.nickname || ''
        },
        messages: []
      }
    },
    methods: {
      isShowDate: function(msg, index) {
        var preMsg = this.messages[index - 1]
        return !preMsg || (msg.receivedTime - preMsg.receivedTime > 1000 * 60)
      },
      transformMessage: function(val) {
        return val.replace(IMAGE_REGXE, function(result) {
          var v = _.find(imageJson, { text: result});
          return '<img src="../res/emotion/' + v.name + '.png" />'
        })
      },
      getHistoryMessage: function() {
        var self = this
        rong.getHistoryMessages({
          conversationType: 'PRIVATE',
          targetId: api.pageParam.targetId,
          //oldestMessageId: 40,
          count: 20
        }, function(ret, err) {
          if (ret.status === 'success') {
            if (ret.result && ret.result.length > 0) {
              self.messages = _.reverse(ret.result)
            }
            Vue.nextTick(function() {
              $('body').scrollTop(1000000)
            })
            //alert(JSON.stringify(ret.result))
          }
        })
      },
      sendTextMessage: function(msg) {
        var self = this
        rong.sendTextMessage({
          conversationType: 'PRIVATE',
          targetId: api.pageParam.targetId,
          text: msg,
          extra: {
            sender: self.myInfo,
            receiver: self.targetInfo
          }
        }, function(ret, err) {
          if (ret.status == 'prepare'){
            self.messages.push(ret.result.message);
            Vue.nextTick(function() {
              $('body').scrollTop(1000000)
            })
            //api.toast({ msg: JSON.stringify(ret.result.message) });
          } else if (ret.status == 'success') {
            //api.toast({ msg: ret.result.message.messageId });
          } else if (ret.status == 'error') {
            api.toast({ msg: err.code });
          }
        });
      },
      sendImage: function() {

      },
      getUserInfo: function(uid, type) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {uid: uid}
        }).then(function(res) {
          var data = ParseJson(res.data)[0]
          if (type === 'user') {
            self.myInfo = {
              avatar: data.pheadimgUrl,
              nickname: data.pnickname
            }
          } else {
            self.targetInfo = {
              avatar: data.pheadimgUrl,
              nickname: data.pnickname
            }
          }
        })
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
            normalImg: 'widget://res/img/icon_image.png',
            activeImg: 'widget://res/img/icon_image.png'
        }, {
            title: '拍照',
            normalImg: 'widget://res/img/chatBox_cam1.png',
            activeImg: 'widget://res/img/chatBox_cam2.png'
        }]
      }
  }, function(ret, err) {
    if(ret.eventType === 'send') {
      vm.sendTextMessage(ret.msg)
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

  api.addEventListener({
    name: 'receiveMessage'
  }, function (ret, err) {
    vm.messages.push(ret.value.data)
    Vue.nextTick(function() {
      $('body').scrollTop(1000000)
    })
  })
}
