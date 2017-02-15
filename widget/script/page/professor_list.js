function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
      	userid: Helper.getUserId(),
        list: []
      }
    },
    methods: {
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getExpert',
          data: {
            userid: self.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
            console.log(ParseJson(res.data)[0])
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
