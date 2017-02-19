/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        userid: Helper.getUserId(),
        money: '',
        accountName: '',
        waccount: '',
        bankcardKHH: '',
        type: '银行卡号',
        wlabel: '',
        wplaceholder: '',
        submiting: false
      }
    },
    computed: {
      canSubmit: function() {
        var k = !!this.userid && this.money > 0 && !!this.accountName && !!this.waccount && !!this.type && !this.submiting
        return this.wtype === '银行卡号' ? (k && !!this.bankcardKHH) : k
      },
      wlabel: function() {
        if (this.type === '银行卡号') {
          return '银行卡号'
        }
        return this.type + '账号'
      },
      wplaceholder: function() {
        if (this.type === '银行卡号') {
          return '请输入银行卡卡号'
        } else if (this.type === '微信') {
          return '请输入微信账号'
        }
        return '请输入支付宝账号'
      }
    },
    methods: {
      onSubmit: function () {
        if (!this.canSubmit) return
        var self = this
        this.submiting = true
        $.ajax({
          url: BaseService.apiUrl + 'yuetx',
          data: _.pick(self, ['userid', 'money', 'accountName', 'waccount', 'bankcardKHH', 'type'])
        }).then(function (res) {
          if (res.key === 'true') {
            api.toast({
              msg: '提现成功'
            });
            setTimeout(function() {
              api.sendEvent({
                name: 'refreshWallet',
              });
              api.closeToWin({
                name: 'mywallet'
              });
            }, 1000)
          } else {
            api.toast({
                msg: res.mage
            });
          }
        }).always(function() {
          self.submiting = false
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}