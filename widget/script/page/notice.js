function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
      this.updateState()
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
          url: BaseService.apiUrl + 'gettz',
          data: { userid: Helper.getUserId() }
        }).done(function(res) {
          console.log(ParseJson(res.data))
          alert(res.data)
          self.list = ParseJson(res.data)
        })
      },
      updateState: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'updatestate',
          data: { tzid: Helper.getUserId() }
        }).done(function(res) {
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
