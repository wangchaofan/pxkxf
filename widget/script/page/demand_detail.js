/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function () {
      this.getData()
    },
    data: function () {
      return {
        demandInfo: null,
        showDialog: false,
        describe: '',
        isMe: true
      }
    },
    computed: {
      userModel: function () {
        if (this.demandInfo) {
          var userModel = this.demandInfo.Usermodel[0]
          userModel.avatarStyle = 'background-image: url(' + userModel.pheadimgUrl + ')'
          return userModel
        }
        return null
      }
    },
    filters: {
      number: function (val) {
        return parseFloat(val)
          .toFixed(2)
      }
    },
    methods: {
      share: function () {
        var sharedModule = api.require('shareAction');
        sharedModule.share({
          type: 'url',
          text: '111',
          path: 'http://www.baidu.com'
        })
      },
      toPay: function () {
        Helper.openWin('pay', {
          mmoney: '20',
          orderId: api.pageParam.id,
          orderType: 'demand',
          fromWin: api.winName
        })
      },
      getData: function () {
        var self = this
        $.ajax({
            url: BaseService.apiUrl + 'getxqinfo',
            data: { xqid: api.pageParam.id, userid: Helper.getUserId() }
            //data: { xqid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00', userid: Helper.getUserId()}
          })
          .done(function (res) {
            self.demandInfo = ParseJson(res.data)[0]
            if (self.demandInfo.Usermodel[0].lUserId !== Helper.getUserId()) {
              self.isMe = false
            }
            console.log(ParseJson(res.data)[0])
          })
      },
      // 确定选择应邀人
      confirmInvite: function (inviteItem) {
        var self = this
        if (inviteItem.ystate == 2) return
        api.confirm({
          title: '提示',
          msg: '确定选择应邀人？',
          buttons: ['确定', '取消']
        }, function (ret, err) {
          if (ret.buttonIndex === 1) {
            $.ajax({
                url: BaseService.apiUrl + 'getgetXQInvitedSate',
                data: { yyddid: inviteItem.InvitedId }
              })
              .then(function (res) {
                if (res.key === 'true') {
                  inviteItem.ystate = 2
                  self.demandInfo.yxnum = parseInt(self.demandInfo.yxnum) + 1
                } else {
                  api.toast({
                    msg: res.mage
                  })
                }
              })
          }
        })
      },
      onClickCancel: function () {
        this.showDialog = false
      },
      onClickSubmit: function () {
        if (!this.describe) {
          alert('请填写你的技能优势')
          return
        }
        var self = this
        var data = {
          // ddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00',
          ddid: api.pageParam.id,
          userid: Helper.getUserId(),
          describe: self.describe
        }
        $.ajax({
            url: BaseService.apiUrl + 'addXQInvited',
            data: {
              // ddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00',
              ddid: api.pageParam.id,
              userid: Helper.getUserId(),
              describe: self.describe
            }
          })
          .done(function (res) {
            if (res.key === 'true') {
              api.toast({ msg: '应邀成功!' });
              self.showDialog = false
              self.demandInfo.yynum = parseInt(self.demandInfo.yynum, 10) + 1
            } else {
              api.toast({
                msg: res.mage
              })
            }
          })
      },
      goChat: function () {
        Helper.openWin('chat_room', { targetId: this.userModel.lUserId })
      },
      goInvite: function () {
        this.showDialog = true
      },
      goInviteNoname: function () {

      }
    }
  })
}

/* === 测试使用 === */
setTimeout(function () {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function () {
  initPage()
}
