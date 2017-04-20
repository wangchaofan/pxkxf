/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getQuestions();
      this.getHostQuestions();
      this.getProfessors();
      this.getBestProfessors();
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
      toQues: function() {
        Helper.openWin('questions')
      },
      viewMoreProfessor: function() {
        Helper.openWin('professor_list')
      },
      viewMoreQuestion: function() {
        Helper.openWin('questions');
      },
      viewProfessorDetail: function(pf) {
        Helper.openWin('professor_detail', {id: pf.expertId});
      },
      viewQuestionDetail: function(qt) {
        Helper.openWin('questions_detail', {id: qt.expertTWId});
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
            self.newQuestions = list.slice(0, 2)
          }
        })
      },
      getHostQuestions: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'zuiewt',
          data: {
            userid: self.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var list = ParseJson(res.data)
            self.hotQuestions = list.slice(0, 2)
          }
        });
      },
      getProfessors: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getzsExpert',
          data: {
            userid: self.userid
          }
        }).then(function(res) {
          if (res.key === 'true') {
            var list = ParseJson(res.data)
            self.freeProfessors = list.slice(0, 2)
          }
        })
      },
      getBestProfessors: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getzsExpert'
        }).then(function(res) {
          if (res.key === 'true') {
            var list = ParseJson(res.data)
            self.bestProfessors = list.slice(0, 2)
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
