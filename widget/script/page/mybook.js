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
          case 3:
            return '<span class="text-warning">不通过</span>'
          default:
            return '已关闭'
        }
      },
      handleViewSupply: function(item) {
        Helper.openWin('supply_detail', pageParam: {id: item.skillID})
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getCollection',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          alert(res.data)
          self.list = ParseJson(res.data)
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
