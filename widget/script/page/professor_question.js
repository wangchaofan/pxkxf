/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getQuestions()
      this.getProfessors()
    },
    data: function() {
      return {
        hotQuestions: [],
        newQuestions: [],
        bestProfessors: [],
        freeProfessors: []
      }
    },
    methods: {
      viewMoreProfessor: function() {
        api.openWin({
          name: 'professor_list',
          url: 'widget://html/professor_list.html',
          reload: true
        });
      },
      viewMoreQuestion: function() {
        api.openWin({
          name: 'questions',
          url: 'widget://html/questions.html',
          reload: true
        });
      },
      viewProfessorDetail: function(pf) {
        console.log(pf)
        api.openWin({
          name: 'professor_detail',
          url: 'widget://html/professor_detail.html',
          reload: true,
          pageParam: {
              id: pf.expertId
          }
        });
      },
      viewQuestionDetail: function(qt) {
        console.log(qt)
      },
      getQuestions: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getTW',
          data: {
            userid: self.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var list = ParseJson(res.data)
            self.hotQuestions = list.slice(0, 2)
            self.newQuestions = list.slice(0, 2)
          }
        })
      },
      getProfessors: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getExpert',
          data: {
            userid: self.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var list = ParseJson(res.data)
            self.freeProfessors = list.slice(0, 2)
            self.bestProfessors = list.slice(0, 2)
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