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
      toAdd: function() {
        Helper.openWin('add_question');
      },
      goQuestionDetail: function(item) {
        Helper.openWin('questions_detail', {id: item.expertTWId});
      },
      getData: function () {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getTW'
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
            console.log(ParseJson(res.data)[0])
          }
        })
      }
    }
  })

  api.addEventListener({
    name: 'refreshQuestion'
  }, function(ret, err) {
    vm.getData()
  });
}

apiready = function(){
  initPage()
}
