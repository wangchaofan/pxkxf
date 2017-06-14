function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        list: [],
        userQslist: [],
        isOnlyMy: api.pageParam.isOnlyMy,
      }
    },
    computed: {
      pageTitle: function() {
        return this.isOnlyMy ? '我的咨询' : '咨询列表'
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
        self.list = []
        self.userQslist = []
        $.ajax({
          url: BaseService.apiUrl + 'getTW'
        }).then(function(res) {
          if (res.key === 'true') {
            var result = ParseJson(res.data);
            var userId = Helper.getUserId();
            _.map(result, function(item) {
              if (item.twUseriD === userId) {
                self.userQslist.push(item);
              } else {
                self.list.push(item);
              }
            });
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
