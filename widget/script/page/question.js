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
        api.openWin({
          name: 'add_question',
          url: 'widget://html/add_question.html',
          realod: true
        });
      },
      goQuestionDetail: function(item) {
        Helper.openWin('question_detail', {id: item.expertTWId});
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
}
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
