function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData();
    },
    data: function() {
      return {
        order: {
          Skillmodel: [{}]
        },
        userModel: null,
        reason: '',
        comments: null,
        ddid: api.pageParam.id
        // ddid: '9ba4714e-727d-40ea-89cf-7763679d229a'
      }
    },
    methods: {
      onClickChat: function() {
        Helper.openWin('chat_room', {targetId: this.userModel.lUserId})
      },
      // === 支付 ===
      toPay: function () {
        api.openWin({
          name: 'pay',
          url: 'widget://html/pay.html',
          pageParam: {
            accountBalance: this.userModel.accountBalance,
            mmoney: this.order.mmoney,
            orderId: this.order.SillYYDDId
          }
        })
      },
      // 取消订单
      handleCancelOrder: function() {
        api.alert({
          title: '提示',
          msg: '请拨打客服电话：028-84315565',
        }, function(ret, err) {

        });
      },
      // === 确认完成 ===
      toConfirm: function() {
        var self = this
        api.confirm({
          title: '提示',
          msg: '是否确定完成？'
        }, function (ret, err) {
          if (ret.buttonIndex == 2) {
            $.ajax({
              url: BaseService.apiUrl + 'yygyddwc',
              data: {
                ddid: self.ddid
              }
            }).done(function(res) {
              api.toast({msg: '供应完成'});
              if (res.key === 'true') {
                self.getData();
              } else {
                api.toast({msg: res.mage})
              }
            }).catch(function(err){
              api.toast({msg: err.message})
            })
          }
        })
      },
      viewUserPage: function(user) {
        console.log(user.lUserId)
        Helper.openWin('user_homepage', {uid: user.lUserId})
      },
      // === 评价 ===z
      toComment: function() {
        Helper.openWin('comment', { id: api.pageParam.id });

      },
      // ===取消 ===
      onCancel: function () {
        var self = this
        var dialogBox = api.require('dialogBox');
        dialogBox.input({
          keyboardType: 'default',
          texts: {
            placeholder: '请输入取消原因',
            leftBtnTitle: '取消',
            rightBtnTitle: '确定'
          },
          styles: {
            bg: '#fff',
            corner: 4,
            w: 300,
            h: 160,
            input: {
              h: 40,
              textSize: 14,
              textColor: '#000'
            },
            title: {
              h: 0
            },
            dividingLine: {
              width: 0.5,
              color: '#696969'
            },
            left: {
              bg: 'rgba(0,0,0,0)',
              color: '#007FFF',
              size: 14
            },
            right: {
              bg: 'rgba(0,0,0,0)',
              color: '#007FFF',
              size: 14
            }
          }
        }, function(ret) {
          if (ret.eventType === 'right') {
            if (ret.text === '') {
              api.toast({
                  msg: '请输入原因'
              })
              return
            } else {
              self.reason = ret.text
              self.toCancel()
            }
          }
          dialogBox.close({
            dialogName: 'input'
          })
        })
      },
      toCancel: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'qxyydd',
          data: {
            userid: Helper.getUserId(),
            ddid: self.ddid,
            reason: self.reason
          }
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '取消成功'
            })
            api.sendEvent({
              name: 'refreshOrder'
            })
            setTimeout(function() {
              api.closeWin()
            }, 3000)
          } else {
            api.toast({
              msg: res.mage
            });
          }
        })
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'yyskillddinfo',
          data: {
            skillddid: self.ddid
            // skillddid: api.pageParam.id
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var data = ParseJson(res.data)
            self.order = data[0]
            self.userModel = data[0].Skillmodel[0].sUsermodel[0]
            self.comments = data[0].Evaluatemodel
            console.log(ParseJson(res.data))
          }
        })
      }
    }
  });

  addEvent(vm)
}

function addEvent(vm) {
  api.addEventListener({
    name: 'refreshOrder',
  }, function (ret, err) {
    vm.getData();
  });
}

apiready = function(){
  initPage()
}
