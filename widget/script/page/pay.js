function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getUserData()
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
        // alert(api.pageParam.orderId)
        var url = api.pageParam.orderType === 'demand' ? 'xqcz' :  'gyddcz';
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
            });
            // 更新order
            api.sendEvent({
              name: 'refreshOrder'
            });
            api.sendEvent({
              name: 'refreshMyDemand'
            });
            setTimeout(function() {
              api.closeWin({name: 'add_order'});
              api.closeWin()
            }, 1000);
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

apiready = function() {
  api.closeWin({name: 'add_order'});
  initPage()
}
