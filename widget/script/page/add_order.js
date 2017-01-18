function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        order: {
        },
        userModel: {
        },
        formData: {
          yydate: '',
          yyaddress: '',
          yymoney: ''
        }
      }
    },
    methods: {
      onClickChat: function() {
        api.openWin({
          name: 'chat_room',
          url: 'widget://html/chat_room.html',
          pageParam: {
            name: 'value'
          }
        })
      },
      onSubmit: function() {
        var self = this
        var data = _.assign({}, this.formData, {userid: Helper.getUserId(), skillid: this.order.skillID, yymoney: this.order.smoney})
        data.yydate = data.yydate ? new Date(data.yydate).getTime() : ''
        $.ajax({
          url: BaseService.apiUrl + 'yyskill',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '发起订单成功'
            })
            setTimeout(function() {
              api.openWin({
                name: 'pay',
                url: 'widget://html/pay.html',
                reload: true,
                progress: {
                  type: 'page'
                },
                pageParam: {
                  mmoney: self.formData.yymoney,
                  orderId: res.data,
                  orderType: 'supply'
                }
              })
              setTimeout(function() {
                api.closeWin()
              }, 2000)
            }, 3000)
          } else {
            alert(res.mage)
          }
        })
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getskillinfo',
          data: {
            // skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
            skillid: api.pageParam.id
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var data = ParseJson(res.data)
            self.order = data[0]
            self.userModel = data[0].sUsermodel[0]
          }
        }, function(err) {
          alert(JSON.stringify(err))
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
