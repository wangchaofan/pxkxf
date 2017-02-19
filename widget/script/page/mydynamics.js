function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        list: []
      }
    },
    methods: {
      viewDetail: function(item) {
        api.openWin({
            name: 'dynamic_detail',
            url: 'widget://html/dynamic_detail.html',
            pageParam: {
                id: item.dynamicsId
            }
        });
      },
      onClickDelete: function(item) {
        var self = this
        api.confirm({
          title: '提示',
          msg: '确认删除？',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          if (ret.buttonIndex === 1) {
            $.ajax({
              url: BaseService.apiUrl + 'deletedt',
              data: {dtid: item.dynamicsId}
            }).then(function(res) {
              if (res.key === 'true') {
                api.toast({msg: '删除成功'});
                self.getData()
              } else {
                api.toast({
                  msg: res.mage
                })
              }
            })
          }
        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getDynamics',
          data: {userid: api.pageParam.uid || Helper.getUserId()}
        }).done(function(res) {
          self.list = ParseJson(res.data)
          console.log(ParseJson(res.data))
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
