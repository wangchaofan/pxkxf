function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.connect()
    },
    data: function() {
      return {
        userId: ''
      }
    },
    methods: {
      connect: function() {
        var self = this
        api.showProgress({
          animationType: 'fade',
          title: '提示',
          text: '正在连接...',
          modal: false
        });
        var rong = api.require('rongCloud2');
        Helper.getRongcloudToken().then(function(res) {
          rong.connect({
            token: res.data
          }, function(ret, err) {
            api.hideProgress()
            if (ret.status == 'success')
              self.userId = ret.result.userId
              // api.toast({ msg: ret.result.userId });
          })
        }, function(err) {
          api.hideProgress()
          alert(JSON.stringify(err))
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
      },
      sendBtn: {
          titleColor: '#4cc518',
          bg: '#999999',
          activeBg: '#46a91e',
          titleSize: 14
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
      if (ret) {
        alert(JSON.stringify(ret));
      } else {
        alert(JSON.stringify(err));
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
