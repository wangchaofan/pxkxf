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
      },
      buttonVisible: function() {
        if (!this.demandInfo) return false;
        var state = this.demandInfo.orderState;
        return state == 1 ||
          (state == 4 && !this.isMe) ||
          (state == 5 && this.isMe) ||
          state >= 6;
      },
      // 是否显示应邀按钮
      inviteButtonVisible: function() {
        return !this.isMe && this.demandInfo && this.demandInfo.yxnum < this.demandInfo.demandNum;
      }
    },
    filters: {
      number: function (val) {
        return parseFloat(val)
          .toFixed(2)
      }
    },
    methods: {
      getStatusText: function(invitor) {
        var orderState = this.demandInfo.orderState;
        var ystate = invitor.ystate;
        if (ystate != 2) return '确认应邀';
        if (invitor.State == 2) return '已选应邀';
        return '';
      },
      share: function () {
        var sharedModule = api.require('shareAction');
        sharedModule.share({
          type: 'url',
          text: '111',
          path: 'http://www.baidu.com'
        })
      },
      handlerCancelOrder: function() {
        api.alert({
          title: '提示',
          msg: '请拨打客服电话：028-84315565',
        }, function(ret, err) {

        });
      },
      handlerComplete: function() {
        var self = this;
        api.confirm({
          title: '提示',
          msg: '是否确定供应完成？',
          buttons: ['确定', '取消']
        }, function (ret, err) {
          if (ret.buttonIndex == 1) {
            $.ajax({
              url: BaseService.apiUrl + 'xqfwwc',
              data: { xqyyid: api.pageParam.id, userid: Helper.getUserId() }
            }).then(function(res) {
              if (res.key == 'true') {
                api.toast({msg: '提交成功'});
                self.getData();
              } else {
                api.toast({msg: res.mage});
              }
            })
          }
        });
      },
      handlerClickConfirm: function(invitor) {
        if (invitor.State != 2) {
          this.confirmInvite(invitor);
        }
      },
      toComment: function() {
        var selectedInvitor;
        if (this.isMe) {
          var invitors = this.demandInfo.XQInvitedmodel;
          for (var i = 0; i < invitors.length; i++) {
            if (invitors[i].State == 2) {
              selectedInvitor = invitors[i].usermodel[0];
              break;
            }
          }
        } else {
          selectedInvitor = this.demandInfo.Usermodel[0];
        }
        Helper.openWin('demand_comment', {orderId: api.pageParam.id, user: selectedInvitor});
      },
      handlerClickDemandComplete: function() {
        var self = this;
        api.confirm({
          title: '提示',
          msg: '是否确定需求完成？',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          if (ret.buttonIndex == 1) {
            $.ajax({
              url: BaseService.apiUrl + 'xqqrwc',
              data: { xqid: api.pageParam.id, userid: Helper.getUserId() }
            }).then(function(res) {
              if (res.key == 'true') {
                api.toast({msg: '提交成功'});
                self.getData();
              } else {
                api.toast({msg: res.mage});
              }
            }, function(err) {
              alert(JSON.stringify(err));
            })
          }
        });
      },
      toPay: function () {
        Helper.openWin('pay', {
          mmoney: this.demandInfo.dmoney * this.demandInfo.demandNum,
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
        if (!this.isMe || inviteItem.ystate == 2 || this.demandInfo.orderState >= 4) return
        if (this.demandInfo.demandNum == this.demandInfo.yxnum) {
          api.toast({msg: '应邀人数已满'});
          return;
        }
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
                  if (self.demandInfo.yxnum == self.demandInfo.demandNum) {
                    self.getData();
                  }
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
          api.toast({msg: '请填写你的技能优势'});
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
              self.showDialog = false;
              self.demandInfo.yynum = parseInt(self.demandInfo.yynum, 10) + 1;
              self.getData();
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
      }
    }
  });

  addEvent(vm);
}

function addEvent(vm) {
  api.addEventListener({
    name: 'refreshMyDemand'
  }, function (ret, err) {
    vm.getData();
  });
}

apiready = function () {
  initPage()
}
