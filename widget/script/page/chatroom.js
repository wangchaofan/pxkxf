var vm;
var rong;
var imageJson = [
  {"name": "Expression_1","text": "[微笑]"},
  {"name": "Expression_2","text": "[撇嘴]"},
  {"name": "Expression_3","text": "[色]"},
  {"name": "Expression_4","text": "[发呆]"},
  {"name": "Expression_5","text": "[得意]"},
  {"name": "Expression_6","text": "[流泪]"},
  {"name": "Expression_7","text": "[害羞]"},
  {"name": "Expression_8","text": "[闭嘴]"},
  {"name": "Expression_9","text": "[睡]"},
  {"name": "Expression_10","text": "[大哭]"},
  {"name": "Expression_11","text": "[尴尬]"},
  {"name": "Expression_12","text": "[发怒]"},
  {"name": "Expression_13","text": "[调皮]"},
  {"name": "Expression_14","text": "[呲牙]"},
  {"name": "Expression_15","text": "[惊讶]"},
  {"name": "Expression_16","text": "[难过]"},
  {"name": "Expression_17","text": "[酷]"},
  {"name": "Expression_18","text": "[冷汗]"},
  {"name": "Expression_19","text": "[抓狂]"},
  {"name": "Expression_20","text": "[吐]"},
  {"name": "Expression_21","text": "[偷笑]"},
  {"name": "Expression_22","text": "[愉快]"},
  {"name": "Expression_23","text": "[白眼]"},
  {"name": "Expression_24","text": "[傲慢]"},
  {"name": "Expression_25","text": "[饥饿]"},
  {"name": "Expression_26","text": "[困]"},
  {"name": "Expression_27","text": "[恐惧]"},
  {"name": "Expression_28","text": "[流汗]"},
  {"name": "Expression_29","text": "[憨笑]"},
  {"name": "Expression_30","text": "[悠闲]"},
  {"name": "Expression_31","text": "[奋斗]"},
  {"name": "Expression_32","text": "[咒骂]"},
  {"name": "Expression_33","text": "[疑问]"},
  {"name": "Expression_34","text": "[嘘]"},
  {"name": "Expression_35","text": "[晕]"},
  {"name": "Expression_36","text": "[疯了]"},
  {"name": "Expression_37","text": "[衰]"},
  {"name": "Expression_38","text": "[骷髅]"},
  {"name": "Expression_39","text": "[敲打]"},
  {"name": "Expression_40","text": "[再见]"},
  {"name": "Expression_41","text": "[擦汗]"},
  {"name": "Expression_42","text": "[抠鼻]"},
  {"name": "Expression_43","text": "[鼓掌]"},
  {"name": "Expression_44","text": "[糗大了]"},
  {"name": "Expression_45","text": "[坏笑]"},
  {"name": "Expression_46","text": "[左哼哼]"},
  {"name": "Expression_47","text": "[右哼哼]"},
  {"name": "Expression_48","text": "[哈欠]"},
  {"name": "Expression_49","text": "[鄙视]"},
  {"name": "Expression_50","text": "[委屈]"},
  {"name": "Expression_51","text": "[快哭了]"},
  {"name": "Expression_52","text": "[阴险]"},
  {"name": "Expression_53","text": "[亲亲]"},
  {"name": "Expression_54","text": "[吓]"},
  {"name": "Expression_55","text": "[可怜]"},
  {"name": "Expression_56","text": "[菜刀]"},
  {"name": "Expression_57","text": "[西瓜]"},
  {"name": "Expression_58","text": "[啤酒]"},
  {"name": "Expression_59","text": "[篮球]"},
  {"name": "Expression_60","text": "[乒乓]"},
  {"name": "Expression_61","text": "[咖啡]"},
  {"name": "Expression_62","text": "[饭]"},
  {"name": "Expression_63","text": "[猪头]"},
  {"name": "Expression_64","text": "[玫瑰]"},
  {"name": "Expression_65","text": "[凋谢]"},
  {"name": "Expression_66","text": "[嘴唇]"},
  {"name": "Expression_67","text": "[爱心]"},
  {"name": "Expression_68","text": "[心碎]"},
  {"name": "Expression_69","text": "[蛋糕]"},
  {"name": "Expression_70","text": "[闪电]"},
  {"name": "Expression_71","text": "[炸弹]"},
  {"name": "Expression_72","text": "[刀]"},
  {"name": "Expression_73","text": "[足球]"},
  {"name": "Expression_74","text": "[瓢虫]"},
  {"name": "Expression_75","text": "[便便]"},
  {"name": "Expression_76","text": "[月亮]"},
  {"name": "Expression_77","text": "[太阳]"},
  {"name": "Expression_78","text": "[礼物]"},
  {"name": "Expression_79","text": "[拥抱]"},
  {"name": "Expression_80","text": "[强]"},
  {"name": "Expression_81","text": "[弱]"},
  {"name": "Expression_82","text": "[握手]"},
  {"name": "Expression_83","text": "[胜利]"},
  {"name": "Expression_84","text": "[抱拳]"},
  {"name": "Expression_85","text": "[勾引]"},
  {"name": "Expression_86","text": "[拳头]"},
  {"name": "Expression_87","text": "[差劲]"},
  {"name": "Expression_88","text": "[爱你]"},
  {"name": "Expression_89","text": "[NO]"},
  {"name": "Expression_90","text": "[OK]"},
  {"name": "Expression_91","text": "[爱情]"},
  {"name": "Expression_92","text": "[飞吻]"},
  {"name": "Expression_93","text": "[跳跳]"},
  {"name": "Expression_94","text": "[发抖]"},
  {"name": "Expression_95","text": "[怄火]"},
  {"name": "Expression_96","text": "[转圈]"},
  {"name": "Expression_97","text": "[磕头]"},
  {"name": "Expression_98","text": "[回头]"},
  {"name": "Expression_99","text": "[跳绳]"},
  {"name": "Expression_100","text": "[投降]"},
  {"name": "Expression_101","text": "[激动]"},
  {"name": "Expression_102","text": "[街舞]"},
  {"name": "Expression_103","text": "[献吻]"},
  {"name": "Expression_104","text": "[左太极]"},
  {"name": "Expression_105","text": "[右太极]"}
];
var IMAGE_REGXE = /(\[[\u4e00-\u9fa5]+])/g;

function clearUnreadStatus() {
  rong.clearMessagesUnreadStatus({
    conversationType: 'PRIVATE',
    targetId: api.pageParam.targetId
  }, function (ret, err) {
    if (ret.status === 'success') {
      if (api.pageParam.unreadCount) {
        api.sendEvent({
          name: 'refreshMsgCount',
          extra: {
            count: 0 - api.pageParam.unreadCount
          }
        })
      } else {
        api.sendEvent({
          name: 'refreshMsgCount',
        })
      }
    }
  })
}

function initPage() {
  rong = api.require('rongCloud2');
  clearUnreadStatus()
  vm = new Vue({
    el: '.wrapper',
    created: function () {
      this.getHistoryMessage();
      this.getUserInfo(Helper.getUserId(), 'user');
      if (!api.pageParam.avatar) {
        this.getUserInfo(api.pageParam.targetId, 'target');
      }
    },
    data: function () {
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
        messages: [],
        viewingImage: '',
        showOriginImage: false
      }
    },
    methods: {
      isShowDate: function (msg, index) {
        var preMsg = this.messages[index - 1]
        return !preMsg || (msg.receivedTime - preMsg.receivedTime > 1000 * 60)
      },
      /* 查看原图 */
      viewOriginImage: function(image) {
        this.showOriginImage = true;
        this.viewingImage = image;
        var UIChatBox = api.require('UIChatBox');
        UIChatBox.hide();
      },
      hideOriginImage: function() {
        this.showOriginImage = false;
        this.viewingImage = '';
        var UIChatBox = api.require('UIChatBox');
        UIChatBox.show();
      },
      transformMessage: function (val) {
        // val.replace(IMAGE_REGXE, function (result) {
        //   var v = _.find(imageJson, { text: result });
        //   return '<img src="../res/emotion/' + v.name + '.png" />'
        // })
        // return val;
        return val.replace(IMAGE_REGXE, function (result) {
          var v = _.find(imageJson, { text: result });
          return '<img src="../res/emotion/' + v.name + '.png" />'
        })
      },
      getHistoryMessage: function () {
        var self = this;
        rong.getHistoryMessages({
          conversationType: 'PRIVATE',
          targetId: api.pageParam.targetId + '',
          oldestMessageId: 0,
          count: 40
        }, function (ret, err) {
          if (ret.status === 'success') {
            if (ret.result && ret.result.length > 0) {
              self.messages = _.reverse(ret.result)
            }
            Vue.nextTick(function () {
              $('body').scrollTop(1000000)
            })
          } else {
            api.toast({
              msg: err.code,
              duration: 2000,
              location: 'middle'
            });
          }
        })
      },
      sendTextMessage: function (msg) {
        var self = this;
        rong.sendTextMessage({
          conversationType: 'PRIVATE',
          targetId: api.pageParam.targetId,
          text: msg,
          extra: JSON.stringify({
            sender: self.myInfo,
            receiver: self.targetInfo
          })
        }, function (ret, err) {
          if (ret.status == 'prepare') {
            ret.result.message.receivedTime = ret.result.message.receivedTime == 0 ? Date.now() : ret.result.message.receivedTime;
            self.messages.push(ret.result.message);
            Vue.nextTick(function () {
              $('body').scrollTop(1000000)
            });
            //api.toast({ msg: JSON.stringify(ret.result.message) });
          } else if (ret.status == 'success') {
            //api.toast({ msg: ret.result.message.messageId });
          } else if (ret.status == 'error') {
            api.toast({ msg: err.code, location: 'middle' });
          }
        });
      },
      selectImage: function() {
        var self = this;
        api.getPicture({
          sourceType: 'library',
          encodingType: 'jpg',
          mediaValue: 'pic',
          destinationType: 'url',
          allowEdit: false,
          saveToPhotoAlbum: false
        }, function(ret, err) {
          if (ret.data) {
            self.sendImageMessage(ret.data);
            self.messages.push({
              content: {
                imageUrl: ret.data,
                thumbPath: ret.data,
                extra: {}
              },
              objectName: 'RC:ImgMsg'
            })
          }
        });
      },
      sendImageMessage: function (imageUrl) {
        var self = this;
        rong.sendImageMessage({
          conversationType: 'PRIVATE',
          targetId: api.pageParam.targetId,
          imagePath: imageUrl,
          extra: JSON.stringify({
            sender: self.myInfo,
            receiver: self.targetInfo
          })
        }, function(ret, err) {
          if (ret.status == 'prepare') {

          } else if (ret.status == 'progress') {
           // api.toast({ msg: ret.result.progress });
          } else if (ret.status == 'success') {
           // api.toast({ msg: ret.result.message.messageId });
          } else if (ret.status == 'error') {
           api.toast({ msg: err.code, location: 'middle' });
          }
        });
      },
      getUserInfo: function (uid, type) {
        var self = this
        $.ajax({
            url: BaseService.apiUrl + 'getuserinfo',
            data: { uid: uid }
          })
          .then(function (res) {
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
      },
      viewHomePage: function(target) {
        Helper.openWin('user_homepage', { uid: api.pageParam.targetId });
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
        }, 
        // {
        // title: '拍照',
        // normalImg: 'widget://res/img/chatBox_cam1.png',
        // activeImg: 'widget://res/img/chatBox_cam2.png'
        // }
      ]
    }
  }, function (ret, err) {
    if (ret.eventType === 'send') {
      vm.sendTextMessage(ret.msg)
    } else if (ret.eventType === 'clickExtras') {
      if (ret.index === 0) {
        vm.selectImage()
      }
    }
  })
}

apiready = function () {
  initChatbox()
  initPage()

  api.addEventListener({
    name: 'receiveMessage'
  }, function (ret, err) {
    vm.messages.push(ret.value.data)
    Vue.nextTick(function () {
      $('body').scrollTop(1000000)
    })
  })
}
