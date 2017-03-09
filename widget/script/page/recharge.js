/**
 * Created by chaofanw on 2017/1/9.
 */
var ALI_PAY_CODE = {
  9000: '支付成功',
  4000: '系统异常',
  4001: '数据格式不正确',
  4003: '该用户绑定的支付宝账户被冻结或不允许支付',
  4004: '该用户已解除绑定',
  4005: '绑定失败或没有绑定',
  4006: '订单支付失败',
  4010: '重新绑定账户',
  6000: '支付服务正在进行升级操作',
  6001: '用户中途取消支付操作',
  0001: '缺少商户配置信息（商户id，支付公钥，支付密钥）',
  0002: '缺少参数（subject、body、amount、tradeNO）',
  0003: '签名错误（公钥私钥错误）'
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        money: '',
        payType: 'ali'
      }
    },
    computed: {
      canSubmit: function() {
        return this.money > 0
      }
    },
    methods: {
      onSelectPayType: function (val) {
        this.payType = val
      },
      onSubmit: function () {
        if (!this.canSubmit) return
        this.payType === 'ali' ? this.payByAli() : this.payByWx()
      },
      paySuccessCallback: function(money) {
        $.ajax({
          url: BaseService.apiUrl + 'zfje',
          data: {
            userid: Helper.getUserId(),
            money: money
          }
        }).always(function() {
          setTimeout(function() {
            api.sendEvent({
              name: 'refreshWallet',
            });
            api.closeToWin({
              name: 'mywallet'
            });
          }, 1000);
        });
      },
      payByWx: function () {

      },
      payByAli: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'zf',
          data: {userid: Helper.getUserId(), money: self.money}
        }).then(function(res) {
          if (res.key === 'true') {
            var data = JSON.parse(res.data);
            var aliPay = api.require('aliPay');
            aliPay.pay({
              subject: data.subject,
              body: data.body,
              amount: data.total_amount,
              tradeNO: data.out_trade_no,
              passback_params: Helper.getUserId()
            }, function(ret, err) {
              if (ret.code == 9000) {
                api.toast({msg: '支付成功'});
                self.paySuccessCallback(data.total_amount);
              } else {
                api.alert({
                  title: '支付结果',
                  msg: ALI_PAY_CODE[ret.code],
                  buttons: ['确定']
                });
              }
            });
          } else {
            api.toast({msg: res.mage})
          }
        }, function(err) {
          api.toast({msg: err.message});
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
