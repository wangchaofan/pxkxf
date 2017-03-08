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
      handleCancel: function(index) {
        var self = this
        api.confirm({
          title: '提示',
          msg: '确定取消？',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          if (ret.buttonIndex == 1) {
            self.cancelFocus(index)
          }
        });
      },
      cancelFocus: function(index) {
        var data = this.list[index]
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'delFriends',
          data: {
            userid: Helper.getUserId(),
            hyuserid: data.hyUserId
          }
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({msg: '取消成功'});
            self.list.splice(index, 1);
          } else {
            api.toast({msg: res.mage});
          }
        })
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getfollow',
          data: {
            userid: Helper.getUserId()
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
            console.log(ParseJson(res.data))
          }
        })
      }
    }
  })

  // api.addEventListener({
  //   name: 'refreshFocusList'
  // }, function(ret, err) {
  //   vm.getData();
  // });
}

initPage();

apiready = function(){
  initPage()
}
