/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        money: 1,
        payType: 'ali'
      }
    },
    computed: {
      canSubmit: function() {
        return this.money > 0
      }
    },
    methods: {
      onSelectPayType: function(val) {
        this.payType = val
      },
      onSubmit: function () {
        if (!this.canSubmit) return
        this.payType === 'ali' ? this.payByAli() : this.payByWx()
      },
      payByWx: function() {

      },
      payByAli: function() {
        var self = this
        var aliPay = api.require('aliPay');
        $.ajax({
          url: BaseService.apiUrl + 'zf',
          data: {userid: Helper.getUserId(), money: self.money}
        }).then(function(res) {
          var data = ParseJson(res.data)
          if (res.key === 'true') {
            aliPay.pay({
              subject: data.subject,
              body: data.body,
              amount: data.total_amount,
              tradeNO: data.out_trade_no
            }, function (ret, err) {
              api.alert({
                title: '支付结果',
                msg: JSON.stringify(ret),
                buttons: ['确定']
              });
            });
          }
        })
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
  initPage()
}