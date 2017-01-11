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
      goQuestionDetail: function(item) {
        api.openWin({
          name: 'question_detail',
          url: 'widget://html/question_detail.html',
          reload: true,
          pageParam: {
            id: item.expertTWId
          }
        });
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
