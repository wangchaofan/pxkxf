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
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'gettxjl',
          data: { userid: MockData.userid }
        }).done(function(res) {
          self.list = ParseJson(res.data)
          console.log(ParseJson(res.data))
        })
      }
    },
    filters: {
      currency: function(val) {
        return val.toFixed(2)
      }
    }
  })
}

apiready = function(){
  initPage()
}
