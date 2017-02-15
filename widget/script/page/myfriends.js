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
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getFriends',
          data: {
            userid: Helper.getUserId()
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
