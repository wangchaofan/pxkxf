function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getUserData()
      this.aliPayPlus = api.require('aliPayPlus');
      var aliPayPlus = api.require('aliPayPlus');
      this.aliPayPlus.config({
        appId: '2016073100134028',
        rsaPriKey: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdMAIgXVBZ19OgT1ls59KOPk23YdfRfTa8jBUgGqBH7f5wzLe',
      }, function(ret, err) {
        //api.alert({
        //  title: '支付结果',
        //  msg: JSON.stringify(ret),
        //  buttons: ['确定']
        //});
      });
    },
    data: function() {
      return {
        accountBalance: 0,
        // mmoney: 100,
        submiting: false,
        mmoney: api.pageParam.mmoney
      }
    },
    methods: {
      getUserData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {
            uid: Helper.getUserId()
          }
        }).then(function(res) {
          self.accountBalance = ParseJson(res.data)[0].accountBalance
        })
      },
      onSubmit: function() {
        if (this.submiting) return
        var self = this
        this.submiting = true
        var url = api.pageParam.orderType === 'demand' ? 'xqcz' :  'gyddcz'
        $.ajax({
          url: BaseService.apiUrl + 'zf',
          data: {userid: Helper.getUserId(), money: self.mmoney}
        }).then(function(res) {
          var data = ParseJson(res.data)
          var aliPayPlus = api.require('aliPayPlus');
          aliPayPlus.pay({
            subject: data.subject,
            body: data.body,
            amount: data.total_amount,
            tradeNO: data.out_trade_no
          }, function(ret, err) {
            api.alert({
              title: '支付结果',
              msg: JSON.stringify(ret),
              buttons: ['确定']
            });
          });
        })
        return
        $.ajax({
          url: BaseService.apiUrl + url,
          data: {
            userid: Helper.getUserId(),
            ddid: api.pageParam.orderId
          }
        }).done(function(res) {
          if (res.key === 'true') {
            api.toast({
                msg: '支付成功'
            })
            setTimeout(function() {
              api.closeWin()
            }, 2000)
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
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
