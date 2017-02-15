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
          url: BaseService.apiUrl + 'getCollection',
          data: { userid: MockData.userid }
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
