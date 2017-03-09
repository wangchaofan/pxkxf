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
      getStateText: function(state) {
        switch(state) {
          case 1:
            return '审核中'
          case 2:
            return '<span class="text-success">供应中</span>'
          // case 3:
            // return '<span class="text-warning">不通过</span>'
          default:
            return '已关闭'
        }
      },
      handleViewSupply: function(item) {
        Helper.openWin('supply_detail', { id: item.cSkillId })
      },
      handleCancel: function(item) {
        var self = this;
        api.confirm({
          title: '提示',
          msg: '确定取消收藏？',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          if (ret.buttonIndex == 1) {
            $.ajax({
              url: BaseService.apiUrl + 'delCollection',
              data: {
                skillid: item.cSkillId,
                userid: Helper.getUserId()
              }
            }).then(function(res) {
              if (res.key == 'true') {
                api.toast({msg: '取消成功'});
                self.getData();
              } else {
                api.toast({msg: res.mage})
              }
            })
          }
        });
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getCollection',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          self.list = ParseJson(res.data)
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
